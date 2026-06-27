# Design — Profile self-only fixes + UI Editor toggles (v3.5)

Date: 2026-06-27
Author: kyso1
Status: approved (awaiting spec review)

## Scope

Four work items for KysoTheme (Kyso UI Editor):

1. **Bug** — custom profile icon does not update the top-bar ("Top") avatar instantly on apply.
2. **Bug** — profile overrides (ranked crest, mastery-score, transparent background) leak onto OTHER players' full profile pages; must be self-only.
3. **Feature** — "League color scheme" switch: keep themed buttons but recolor to League's native gold.
4. **Feature** — "Swap mastery icon" switch: toggle whether the profile-icon swap also replaces the champion mastery icon (`.style-profile-champion-icon-masked`).

Out of scope: button shape/layout redesign, hovercard self-guard (already correct), any non-listed surface.

---

## Item 1 — Top icon updates instantly

### Problem
Changing the icon does not refresh the top-bar avatar (`lol-uikit-radial-progress > div.top > img`) until the user toggles the "sync navbar" switch off and on.

### Root cause
`applyIcon(url, allPlayers = false, syncNavbar = false)` builds the icon CSS block. The Top selector is only included when `syncNavbar` is truthy (`settingsPage.js` ~2063-2064). The three icon-apply handlers call `applyIcon` WITHOUT the third arg:

- `settingsPage.js:3867` (crop-confirm) — `applyIcon(dataUrl, allPlayers)`
- `settingsPage.js:3878` (apply button) — `applyIcon(url, allPlayers)`
- `settingsPage.js:3902` (all-players checkbox) — `applyIcon(url, allPlayers)`

`syncNavbar` therefore defaults to `false`, so each apply rewrites the `KYSO-ICON` block WITHOUT the Top selector, removing the top-bar override. Toggling the switch (`settingsPage.js:4086`, which passes `s.iconSyncNavbar`) re-injects it — hence the off/on workaround.

### Fix
Read `iconSyncNavbar` from saved settings in all three handlers and pass it through (alongside the new `swapMastery` arg from Item 4). Top-bar avatar then updates on every apply when the sync switch is on.

### Acceptance
- With "sync navbar" ON, applying a new icon updates the top-bar avatar immediately, no toggle needed.
- With "sync navbar" OFF, behavior unchanged (Top untouched).

---

## Item 2 — Profile overrides self-only

### Problem
Opening ANOTHER player's full profile page paints it with the local player's chosen crest image, ranked crest/tier, mastery-score (LP), and transparent background. These must apply only to the local player's own profile.

### Surfaces (all on the full profile page: `lol-regalia-profile-v2-element` / `.style-profile-*`)
Currently unguarded:
- `applyCrest(url)` → `_updateCrestDom` paints CREST_CSS into EVERY `lol-regalia-crest-v2-element` (no guard at all). `assetReplacers.js:258-266`.
- `applyCrestRank` profile-page parts (`assetReplacers.js:406-478`):
  - profile crest-v2 (the non-hovercard branch — `_crestAllowed` returns `true` when not in a hovercard)
  - `.style-profile-emblem-subheader-ranked > div` (tier label)
  - `.style-profile-champion-mastery-score` (LP text)
  - `.ranked-tooltip-queue` emblem/tier/LP
  - `lol-regalia-emblem-element` outside tooltip queues (main profile emblem)
- `applyProfileBgTransparent(hidden)` → `.style-profile-backdrop-component … .uikit-background-switcher`. `assetReplacers.js:627+`.
- `_updateProfileIconDom` profile-page crest paint (`assetReplacers.js:113-122`) — gate for consistency (icon should not leak to other profile pages either).

Already correct (do NOT change):
- Hovercard surfaces — guarded by `_crestAllowed` (`_hovercardHost` summoner-id === `_selfSummonerId`).
- Lobby slots / parties banner — guarded by `voice-puuid === _selfPuuid` / `.lobby-banner.local`.

### Self-detection: `_profileIsSelf()`
Chosen mechanism (user decision): compare the displayed name on the profile page to the local player's name.

1. Extend `ensureSelfSummonerId` to also capture the local name from `/lol-summoner/v1/current-summoner`:
   - store `_selfGameName = String(d.gameName || d.displayName || "")` (normalized: trim + lowercase).
2. Add `_profileIsSelf()`:
   - Locate the profile-page name node inside `lol-regalia-profile-v2-element` (light + shadow). Candidate selectors, first match wins (exact selector confirmed in-client during impl): the Riot-ID / username node within `.style-profile-*` header. Normalize its text (trim, lowercase, strip any `#tagline` suffix).
   - Return `true` if the normalized profile name equals `_selfGameName`.
   - Fallback: if `_selfGameName` is empty (LCU not resolved yet) OR the name node cannot be found, return `false` (fail closed — do not paint a profile we cannot confirm is ours; re-applies once LCU resolves via the existing `ensureSelfSummonerId(onResolved)` re-run).

### Fix
Gate every profile-page surface listed above behind `_profileIsSelf()`:
- `applyCrest` / `_updateCrestDom`: skip crests that are on the profile page (not in a hovercard) unless `_profileIsSelf()`. Crests inside hovercards keep using `_crestAllowed`. Sidebar/lobby crests unaffected.
- `_updateCrestRankDom`: wrap the profile-page branches (subheader text, mastery-score, tooltip queues, emblem elements, and the non-hovercard crest-v2 setAttrs) in `_profileIsSelf()`. Hovercard branch stays on `_crestAllowed`.
- `applyProfileBgTransparent`: only zero the backdrop when `_profileIsSelf()`; otherwise leave the client default.
- `_updateProfileIconDom`: gate the profile-page crest paint (lines 113-122) behind `_profileIsSelf()`. Sidebar avatar + lobby/parties paths unchanged.

Each gated path must re-run after LCU resolves (already wired: every `apply*` calls `ensureSelfSummonerId(() => _update…())`) and on the existing MutationObservers so a freshly opened self profile gets painted.

### Acceptance
- Local player's own profile page: crest image, ranked crest/tier, mastery-score, transparent bg all apply (unchanged).
- Any other player's profile page: none of the above apply — shows the client's real data.
- Hovercards, sidebar, lobby slots, parties banner: unchanged.

---

## Item 3 — "League color scheme" switch

### Behavior
New UI-editor toggle `lolColorScheme` (default `false`). When ON: the theme keeps its custom buttons (shape, play-button styling) but uses League's native gold instead of the user accent.

### Implementation
- `DEFAULTS.lolColorScheme = false`.
- Constant `LOL_GOLD = "#C8AA6E"` (canonical League border gold).
- Accent routing in `applyTheme` (`settingsPage.js` ~2421): when `merged.lolColorScheme`, call `applyAccentColor(LOL_GOLD)` and force the RGB effect off (`applyRgbEffect("none", …)`), ignoring `accentColor`. Otherwise current behavior (`applyAccentColor(merged.accentColor || "")` + `applyRgbEffect(merged.rgbMode, …)`).
- Because all themed buttons/borders/text key off `--kyso-accent` and the computed `--kyso-filter` (theme.css), forcing the accent to gold recolors them to League gold automatically. Button shapes and the themed play button are untouched.
- UI (color section, `settingsPage.js` ~2943-2958): when `lolColorScheme` is ON, disable + grey the accent color input, hex input, and RGB-mode controls (they have no effect while the scheme is forced).

### Acceptance
- Toggle ON → buttons/text/borders render in League gold; accent + RGB controls greyed; button shapes/play button unchanged.
- Toggle OFF → returns to the user's custom accent / RGB exactly as before.
- Persists across restarts.

---

## Item 4 — "Swap mastery icon" switch

### Behavior
New UI-editor toggle `iconSwapMastery` (**default `false`** — behavior change: the mastery-icon swap becomes opt-in). Controls whether the profile-icon override also replaces the champion mastery icon at `.style-profile-champion-icon-masked > img`.

### Implementation
- `DEFAULTS.iconSwapMastery = false`.
- Change `applyIcon` signature to `applyIcon(url, allPlayers = false, syncNavbar = false, swapMastery = false)`.
- In the all-players block (`settingsPage.js:2055`): include `.style-profile-champion-icon-masked > img` in the `content:url()` group only when `swapMastery`.
- In the self block (`settingsPage.js:2062-2066`): build the masked selector fragment conditionally on `swapMastery` (independent of `syncNavbar`); the top-bar radial-progress fragment stays on `syncNavbar`.
- Pass `merged.iconSwapMastery` from `applyTheme` and `s.iconSwapMastery` from every icon handler + the live toggle bind.
- Default OFF → `.style-profile-champion-icon-masked > img` not overridden → real champion mastery icon shows.

Note (accepted limitation): the masked-icon rule is plain CSS and cannot be puuid-scoped, so when `iconSwapMastery` is ON it swaps the mastery icon on any open profile page. This is opt-in and acceptable.

### Acceptance
- Default (OFF): changing the profile icon leaves the champion mastery icon (`.style-profile-champion-icon-masked`) intact.
- ON: mastery icon is replaced by the chosen profile icon (previous behavior).
- Persists across restarts.

---

## UI placement
Items 3 and 4 add toggles to the existing UI-editor toggle list (`tog(...)` block ~`settingsPage.js:3990-4010`) with matching `bindToggle` handlers (~4080-4090) and `boolOf` reads in the settings collector (~3420-3430). Labels added to all locale tables (en/pt/es/de/ja/ko) in the i18n block.

## Files touched
- `settingsPage.js` — `applyIcon` signature + CSS, 3 icon handlers, `applyTheme` accent routing + icon args, 2 new toggles (markup + bind + collector + i18n labels), accent-control disable logic.
- `assetReplacers.js` — `ensureSelfSummonerId` name capture, new `_profileIsSelf()`, self-guards in `_updateCrestDom`/`_updateCrestRankDom`/`applyProfileBgTransparent`/`_updateProfileIconDom`.

## Risks / verification
- Profile name-node selector is the one unconfirmed detail — verified against the live DOM during implementation (user tests in-client). `_profileIsSelf` fails closed if the node is missing, so a wrong selector under-applies (safe) rather than leaking.
- `_profileIsSelf` adds a name read inside the crest observers (already debounced) — negligible cost.
- All four items are independent; can be implemented/tested separately.

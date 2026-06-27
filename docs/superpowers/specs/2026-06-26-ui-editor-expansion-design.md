# KysoTheme UI Editor Expansion v3.2 — Design Spec

**Date:** 2026-06-26
**Status:** Awaiting user review
**Author:** Kyso (with Claude)

## Goal

Expose hardcoded `theme.css` behaviors as user-configurable UI Editor controls,
add a search bar to the UI Editor, fix regressed toggles, and clean up the
Crests block. Every theme behavior must remain a toggle/switch (project rule:
each behavior is a toggle OR a first-run prompt).

## Core principle / architecture (Approach 1 — relocate to JS)

Each toggleable rule **leaves `theme.css`** and moves into a gated JS apply
function that emits CSS only when the setting calls for it. Defaults reproduce
today's look exactly. One element = one rule = one source of truth.

This is the established precedent in the codebase (the play-button nav offsets
were relocated from `theme.css` into `_themedNavCss()` gated by `!playVanilla`;
`applyHideOptions` already builds per-element `<style>` strings from settings).

Relocating also **fixes the regressions**: today `theme.css` hardcodes
hover-fades (`.summoner-xp-radial-container`, `.style-profile-skin-picker-button`,
`.launch-lor-button-container`, `.deep-links-promo`) that duplicate and fight the
JS toggles (`gearAlwaysVisible`, `lorAlwaysVisible`). Two competing `!important`
rules on one element → the toggle cannot win. Removing the `theme.css` copy and
keeping a single gated JS rule resolves it.

### Apply functions (in `settingsPage.js` unless noted)

- `applyHideOptions(s)` — **extended** with Bucket A hover-fades + force-hides.
- `applyVisualToggles(s)` — **new**, Bucket C visual effects.
- `assetReplacers.applyScreenBackgrounds(s)` — **new**, Bucket B per-screen images.
- `applyInterfaceToggles(s)` — existing; the gear/LoR hardcoded duplicates it
  fights get removed from `theme.css` (regression fix).

Each apply fn writes a fenced block into the shared dynamic `<style>` using the
same splice pattern `applyHideOptions` uses today
(`/* KYSO-VIS-START */ … /* KYSO-VIS-END */`, regex-replaced on each call so the
block is idempotent and never duplicates). Fences must be unique per function.

## Bucket A — hide/show toggles

All default to the **current theme look**. Hover-fade items: OFF = fade-until-hover
(current), ON = always visible. Force-hidden items: OFF = hidden (current),
ON = shown.

| Setting key | Default | Selector(s) | Semantics |
|---|---|---|---|
| `alwaysShowXpRadial` | `false` | `.summoner-xp-radial-container` | fade → always |
| `alwaysShowRuneRec` | `false` | `.rune-recommender-button-component` | fade → always |
| `alwaysShowDeepLinks` | `false` | `.deep-links-promo` | fade → always |
| `showLootBackdrop` | `false` | `.loot-backdrop` | hidden(opacity:0) → shown |
| `showIncidentTicker` | `false` | `.navigation-status-ticker.has-incidents` | hidden → shown |
| `showRestrictionWarning` | `false` | `.player-restriction-info-component .player-restriction-warning-icon` | hidden → shown |
| `showLoadingSpinner` | `false` | `.lol-loading-screen-spinner` | hidden → shown |
| `showLobbyOverlay` | `false` | `.v2-header-component .lobby-header-overlay` | hidden → shown |
| `showNavDividers` | `false` | `.right-nav-vertical-rule` | hidden → shown |
| `showActivityDivider` | `false` | `#activity-center .activity-center__tabs_section-divider` | hidden → shown |

Notes:
- `alwaysShowXpRing` (`.xp-ring`, social sidebar level icon) already exists and
  is a **different element** from `alwaysShowXpRadial`. Both fully relocate to JS.
- `showNavDividers` = the vertical rules separating top-navbar items. `theme.css`
  has TWO `.right-nav-vertical-rule` rules (one `visibility:hidden`, one
  `display:none`); both relocate; ON emits nothing (native visible), OFF emits
  `display:none !important`.

## Bucket B — per-screen backgrounds

Four screens: **Collections, Champ-select, Runes, Mode-switcher**. Image picking
lives in the **Assets tab** (consistent with the existing main background / loading
pickers — those are **not** modified). On/off lives in the **UI Editor**.

### Defaults

| Screen | enable flag (default) | Current `theme.css` |
|---|---|---|
| Champ-select | `champSelectBgEnabled: true` | `champ-select-and-runes.jpg` |
| Runes | `runesBgEnabled: true` | `champ-select-and-runes.jpg` (perks-body) |
| Collections | `collectionsBgEnabled: false` | `collections-bg.jpg` |
| Mode-switcher | `modeSwitcherBgEnabled: false` | `switch.jpg` @ `opacity:0` (already invisible) |

- **ON** = the configured image (default = the screen's current theme JPG, via
  manifest defaults).
- **OFF** = transparent — the global `#kyso-global-bg` shows through (consistent
  with how in-game/postgame screens are already made transparent).

### DataStore keys (new in DEFAULTS)

Per screen, the source/local/web triple mirroring existing assets, plus the flag:

```
collectionsBgSource: "local", collectionsBgLocal: "Collections/collections-bg.jpg", collectionsBgWeb: "", collectionsBgEnabled: false,
champSelectBgSource: "local", champSelectBgLocal: "Runes and Select/champ-select-and-runes.jpg", champSelectBgWeb: "", champSelectBgEnabled: true,
runesBgSource: "local", runesBgLocal: "Runes and Select/champ-select-and-runes.jpg", runesBgWeb: "", runesBgEnabled: true,
modeSwitcherBgSource: "local", modeSwitcherBgLocal: "ModeSwitcher/switch.jpg", modeSwitcherBgWeb: "", modeSwitcherBgEnabled: false,
```

### manifest.json

Add 4 categories so each picker shows the bundled options already on disk:

```
collectionsBackgrounds: [ {Collections/collections-bg.jpg}, {Collections/collections-bg22.jpg} ]
champSelectBackgrounds: [ {Runes and Select/champ-select-and-runes.jpg}, {Runes and Select/1.jpg} ]
runesBackgrounds:       [ {Runes and Select/champ-select-and-runes.jpg}, {Runes and Select/1.jpg} ]
modeSwitcherBackgrounds:[ {ModeSwitcher/switch.jpg}, {ModeSwitcher/switch1.jpg} ]
```

(Exact labels/paths verified against existing files in `assets/manifest.json`
`backgrounds` list during implementation.)

### Assets tab

Four new `buildAssetBlock(...)` pickers (local/web/upload). They drop into the
existing panel structure and the existing per-category handler loop
(`ASSET_APPLIERS`) — the current background/banner/crest/icon/loading blocks are
**untouched**.

### apply — `assetReplacers.applyScreenBackgrounds(s)`

Injects one head `<style id="kyso-screenbg-style">`. For each screen: if enabled,
set `background-image: url(resolved)` (and for mode-switcher `opacity:1`); if
disabled, force `background: transparent !important; background-image: none
!important` so the global bg shows. Targets:
- Collections: `.collections-application`, `.collections-routes`
- Champ-select: `.champion-select`
- Runes: `.perks-body-content`
- Mode-switcher: `:host .lol-uikit-background-switcher-image`,
  `.parties-view .parties-background .uikit-background-switcher`

### UI Editor cross-tab grey-out

UI Editor gets a "Screen backgrounds" section with 4 toggles. Toggle OFF → the
matching Assets-tab picker is disabled (greyed) with an overlay hint
**"Ative no UI Editor"** (i18n key `enableInUiEditor`). Shared helper
`applyScreenBgDisabledUI(panel, s)` runs when either panel builds and when a
toggle changes. Because the two panels are separate DOM subtrees built
independently, the helper queries the live Assets panel by a stable selector
(`.kyso-asset-section[data-cat="champSelectBg"]`, etc.) and no-ops if absent.

## Bucket C — visual-effect toggles

All default **ON** (preserve current look). `applyVisualToggles(s)` emits the
rule when ON, nothing when OFF (native).

| Setting key | Default | Behavior relocated from `theme.css` |
|---|---|---|
| `killClientBlur` | `true` | `*,*::before,*::after{backdrop-filter:none}` + `.parties-view .parties-background{height:0}` + navbar blur kills |
| `storeHueOverlay` | `true` | `.yourshop-root:before` / `.store-backdrop:before` accent hue-blend |
| `readyCheckAnim` | `true` | `.ready-check-*` fadeIn animations |
| `viewportGlow` | `true` | `#rcp-fe-viewport-root` accent drop-shadow |

`@keyframes fadeIn` stays in `theme.css` (it is also used by other rules); only
the `.ready-check-*` consumers are gated.

## Crest cleanup

`manifest.json` → `crests: []` (remove all 11 default elo SVG entries
Iron→Challenger + Unranked). The crest `buildAssetBlock` then shows only the
web/upload path for **custom** crests. The rank `<select>` + division dropdown
(`crestRank` / `crestDivision` → `assetReplacers.applyCrestRank`) remain as the
optimized elo-default path. No code change to the rank select.

## Search bar (UI Editor only)

Sticky text input pinned at the top of the UI Editor panel.

- Live `input` listener; case-insensitive substring match against each control
  row's visible label text (`.kyso-label`).
- Non-matching rows → `display:none`. A section whose rows are all hidden → its
  `<h3>` header hidden too.
- Empty query → restore all rows/sections.
- `×` clear button resets.
- Zero matches → a "Nenhum resultado" line (i18n `searchNoResults`).
- Scope: UI Editor tab only (does not search the KysoTheme or Assets tabs).
- Implementation: tag each row with its lowercased label in a `data-kyso-search`
  attribute at build time so the filter never reflows text nodes.

## Regression audit

1. The structural fix (relocating duplicated hover-fades out of `theme.css`)
   removes the gear/LoR/XP conflicts.
2. After relocation, re-verify each UI Editor toggle's selector by reading
   source. Known suspect: the XP-ring hover restore chain
   `.identity-icon:hover > .summoner-level-icon > .xp-ring` (strict `>` chain may
   not match live DOM). Any selector that cannot be confirmed from source is
   handed to the user for an in-client test, or DevTools is used **only with
   explicit per-session permission** (memory: workflow-no-devtools-without-asking).
3. Audit covers every existing UI Editor toggle, not only the new ones.

## i18n + first-run

- ~22 new translation keys, each added to `en` and `pt` (the `t()` helper falls
  back to `en`, so es/de/ja/ko inherit English until translated).
- New section titles: `screenBgSection`, plus labels for every key above, plus
  `enableInUiEditor`, `searchPlaceholder`, `searchNoResults`.
- No welcome-modal change: all new controls default to the current look, so the
  "toggle OR first-run prompt" rule is satisfied by the toggles alone.

## Files touched

- `settingsPage.js` — DEFAULTS (new keys), TRANSLATIONS (en+pt), extended
  `applyHideOptions`, new `applyVisualToggles`, `buildUIEditorPanel` (new
  sections + search bar + binds), `buildAssetsPanel` (4 new pickers + grey-out),
  `applyAllSettings` wiring.
- `assetReplacers.js` — `applyScreenBackgrounds`, `applyScreenBgDisabledUI` helper.
- `main-theme/theme.css` — remove ~18 relocated rules (Bucket A/B/C sources).
- `assets/manifest.json` — 4 new screen-bg categories; empty `crests`.

## Out of scope (YAGNI)

- No new welcome-modal entries.
- No per-screen pickers beyond the 4 named screens.
- No translation of new keys into es/de/ja/ko (fallback to en is acceptable;
  pt is authored because it is the user's language).
- Minor always-hidden cosmetics not listed (home error/spinner,
  mythic/moon-skin backdrop) stay hardcoded unless the user adds them later.

## Open items to confirm at spec review

1. Collections + Mode-switcher default **OFF** (transparent/global-bg) — confirm.
2. OFF state = transparent (global bg) for all 4 screens — confirm (vs vanilla
   Riot art).
3. Bucket C all default **ON** — confirm.

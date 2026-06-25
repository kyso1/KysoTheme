# Kyso UI Editor v3.1 — Design Spec

Date: 2026-06-25
Status: Approved (design), pending spec review
Plugin: KysoTheme (Pengu Loader, League of Legends client theme)

## Goal

Turn fixed theme behaviors into user-controllable options. Per the user's rule:
**every behavior listed here must be EITHER a switch/slider in settings OR presented
in a first-run prompt.** Defaults preserve the current look — all new options are opt-in
(except `iconSyncNavbar`, see §1). Plugin display name becomes "Kyso UI Editor v3.1";
folder name, asset paths, and DataStore key stay `KysoTheme` (no migration).

## Source-of-truth files

- `settingsPage.js` (3225 lines) — DEFAULTS, DataStore persistence, `buildSettingsPanel`,
  `applyAllSettings`, i18n (`TRANSLATIONS`/`t()`), toggle/slider wiring arrays.
- `assetReplacers.js` — shadow-DOM injection for banner/crest/profile-icon.
- `main-theme/theme.css` — static restyles (play button, social sidebar, gear/LoR buttons).
- `index.js` — `@name` header, blur-scrubber (`initBlurScrubber`).
- `README.MD` — title.

## Existing patterns to reuse (confirmed)

- **Storage**: single DataStore blob `KysoTheme.settings` (JSON). Read via
  `{ ...DEFAULTS, ...loadSettings() }`, write via `saveSettings(s)`.
- **Toggle**: `<input type="checkbox" id="kyso-...">` row + entry in `toggles[]` array
  (settingsPage.js ~L2328) + field in save-all (~L2610) + apply call.
- **Slider**: `<input type="range" class="kyso-range">` + `<span id="...-value">` + entry
  in `filterRanges[]` (~L2543) or standalone listener. Live-applies on `input`.
- **Master apply**: `applyAllSettings(settings)` (~L1721) — add new apply calls here so
  effects survive reloads.
- **i18n**: add key to each of 6 locale blocks in `TRANSLATIONS` (en/pt/es/de/ja/ko),
  reference via `t("key")`. English is fallback.
- **No first-run logic exists** — built from scratch.

## §0. New settings keys (added to DEFAULTS)

| Key | Type | Default | Notes |
|---|---|---|---|
| `iconSyncNavbar` | bool | `true` | Only acts when a custom profile icon is set → safe default-on |
| `bannerHidden` | bool | `false` | |
| `profileBgTransparent` | bool | `false` | |
| `gearAlwaysVisible` | bool | `false` | preserve = hover-only |
| `lorAlwaysVisible` | bool | `false` | preserve = hover-only |
| `playVanilla` | bool | `false` | preserve = themed |
| `playBgOpacity` | int 0–100 | `0` | backdrop alpha %, themed mode only |
| `playBgBlur` | int 0–20 | `0` | backdrop blur px, themed mode only |
| `socialBlur` | int 0–20 | `0` | preserve = no blur (current force-kills it) |
| `hasSeenWelcome` | bool | `false` | first-run gate |

## §1. Profile icon → top-right navbar (request 1)

Today the chosen profile icon (`iconUrl`) is applied to: profile-page crest (shadow DOM)
and social sidebar avatar. Add the **top navbar summoner icon** as a third target, gated by
`iconSyncNavbar` (default on).

- Extend the self-only icon apply path (settingsPage.js `applyIcon` / assetReplacers
  `applyProfileIcon`) to also write the icon to the navbar element when `iconSyncNavbar`.
- **Selector RISK**: exact navbar summoner-icon selector is not in current code. Candidate:
  `.top > .icon-image.has-icon` (used today only in icon "all players" mode). Resolve against
  `debug.js` / live DOM during implementation. If selector sets `src` (IMG) use `src`,
  else set `background-image` (mirror existing `_updateProfileIconDom` dual handling).
- MutationObserver re-applies (navbar re-renders). Reuse existing observer pattern.
- Empty `iconUrl` → no-op (leave Riot default).

## §2. Profile background champion-splash transparent (request 2)

No current rule touches the profile-page champ-splash. Add `profileBgTransparent` toggle →
when on, inject CSS making the profile splash transparent so `#kyso-global-bg` shows through.

- **Selector RISK**: profile champ-splash selector not in current code. Investigate
  `lol-regalia-profile-v2-element` subtree / profile background container in live DOM +
  `debug.js`. Likely `opacity:0 !important` or `background:transparent !important` /
  `display:none` on the splash layer (NOT the whole profile).
- Applied via `applyInterfaceToggles` into the dynamic `<style>` (light DOM) if selector is
  light-DOM; if inside a shadow root, use the assetReplacers deep-inject mechanism.

## §3. Gear ⚙️ + LoR buttons — perma vs hover (request 3)

Current theme.css L101–126: `.style-profile-skin-picker-button` (gear) and
`.launch-lor-button-container` + `.deep-links-promo` (LoR) are `opacity:0`, fade to `1` on
hover. Two **separate** toggles (decision: two, not one combined):

- `gearAlwaysVisible` → inject `.style-profile-skin-picker-button{opacity:1 !important}`
- `lorAlwaysVisible` → inject
  `.launch-lor-button-container,.deep-links-promo{opacity:1 !important}`
- Both default off (hover-only preserved). Injected by `applyInterfaceToggles`.

## §4. Banner fully hidden (request 4)

`bannerHidden` toggle → new `applyBannerVisibility(hidden)` in `assetReplacers.js`, using the
same deep-shadow walk as `applyBanner`. Injects `:host{display:none !important}` (style id
`kyso-banner-hide`) into every `lol-regalia-banner-v2-element` shadow root when hidden; clears
it when not. MutationObserver re-applies. Called from `applyAllSettings`. Independent of the
banner-image override (`applyBanner`) — hide wins when both set.

## §5. Play button — vanilla toggle + transparency/blur sliders (request 5)

theme.css L258–260 (frame art off), L374–388 (transparent pill + accent border + glow),
L389–439 (PLAY→▶ glyph) restyle the button.

- `playVanilla` toggle → inject overrides that neutralize the theme restyle so the vanilla
  frame/text returns: restore `.play-button-frame` background-image, drop the
  `.play-button-container` border/transparent/drop-shadow, restore `.play-button-text`.
  (Implementation: a counter-CSS block injected by `applyInterfaceToggles`. Simpler than
  editing theme.css conditionally; keeps theme.css static.)
- `playBgOpacity` (0–100) + `playBgBlur` (0–20px) sliders → in **themed** mode inject
  `.play-button-container{background:rgba(0,0,0,<opacity/100>) !important;
  backdrop-filter:blur(<blur>px) !important;}`. Decision: keep both sliders even though they
  have no effect when `playVanilla` is on (vanilla frame covers the backdrop). UI may grey
  them out when vanilla is on (nice-to-have, not required).

## §6. Social-panel blur slider (request 6)

Current `index.js` `initBlurScrubber` force-removes `backdrop-filter`/`filter:blur` on
`.lol-social-sidebar`, `.lol-social-roster`, `.lol-social-lower-pane-container`, etc., on every
mutation (inline `!important`). To allow a blur slider without a specificity war:

- Fold the slider into the scrubber. Scrubber reads `socialBlur` from DataStore. For the
  **social targets** (sidebar, roster, lower-pane, parties), when `socialBlur > 0` it sets
  `backdrop-filter:blur(<n>px) !important` instead of removing it; when `0` it removes (current
  behavior). Navbar/frame targets stay hard-killed regardless.
- `applySocialBlur(px)` updates the scrubber's current value + triggers a re-scrub; called from
  `applyAllSettings` and live from the slider's `input` handler.
- Default `0` = identical to today.

## §7. First-run welcome modal (the "prompt on first entry" half of the rule)

New `showWelcomeModal()` in `settingsPage.js`, called from `initSettingsPage()` when
`!{ ...DEFAULTS, ...loadSettings() }.hasSeenWelcome`.

- Overlay + Kyso-styled card. Controls (5, the most visual):
  Play (Vanilla/Themed → `playVanilla`), Banner (On/Off → `bannerHidden`),
  Gear+LoR (Always/Hover → sets both `gearAlwaysVisible`+`lorAlwaysVisible`),
  Profile bg art (Keep/Transparent → `profileBgTransparent`), Social blur slider (`socialBlur`).
- **Apply**: write chosen settings, `saveSettings`, `applyAllSettings`, set `hasSeenWelcome=true`.
- **Skip**: set `hasSeenWelcome=true` only (keeps preserve-current defaults).
- Shows exactly once. All five controls remain editable afterward in the Interface section (§8).
- i18n: all modal strings via `t()` in 6 locales.

## §8. New "Interface" settings section

New `<section class="kyso-settings-section" id="kyso-interface-section">` in
`buildSettingsPanel`, inserted after the RGB section. Contents:

- Toggles: Profile icon → navbar (`iconSyncNavbar`), Hide banner (`bannerHidden`),
  Transparent profile background (`profileBgTransparent`), Gear always visible
  (`gearAlwaysVisible`), LoR always visible (`lorAlwaysVisible`), Vanilla play button
  (`playVanilla`).
- Sliders: Play bg opacity (`playBgOpacity`), Play bg blur (`playBgBlur`), Social blur
  (`socialBlur`).
- Wire toggles via `toggles[]` array; for the new apply target, route to a new
  `applyInterfaceToggles(s)` (and `applyBannerVisibility`, `applySocialBlur`, icon path).
  Wire sliders via `filterRanges[]`-style entries (or standalone) calling their apply fns.
- Add every new key to the save-all object.

## §9. Rename → "Kyso UI Editor v3.1" (bonus)

Display-only:
- `index.js` header `@name Kyso Theme v3.0` → `Kyso UI Editor v3.1`.
- `buildSettingsPanel` panel title/header text → "Kyso UI Editor", version label `v3.1`.
- `README.MD` title.
- Folder `KysoTheme`, `PLUGIN_ASSETS_BASE`, `STORE_KEY = "KysoTheme.settings"` **unchanged**.

## §10. Apply-order additions to `applyAllSettings`

Add (preserving existing calls): `applyInterfaceToggles(merged)`,
`assetReplacers.applyBannerVisibility(merged.bannerHidden)`,
`applySocialBlur(merged.socialBlur)`, and pass `iconSyncNavbar` into the icon apply path.

## Error handling

- Missing DOM targets (navbar icon, profile splash, banner shadow root): apply functions
  no-op silently if `querySelector`/deep-walk returns nothing; MutationObserver re-applies
  when the element mounts. Mirror existing `if (!el) return;` guards.
- Selector unknowns (§1, §2): if a robust selector can't be found, ship the toggle wired to a
  best-effort selector and note the limitation; do not block the rest.
- Manifest/DataStore parse failures already handled by existing try/catch — unchanged.

## Testing checklist (manual, in-client)

1. Fresh install (no saved settings) → welcome modal appears once; Skip → never reappears.
2. Each toggle flips the corresponding behavior live (no reload) and persists across reload.
3. `iconSyncNavbar` on + custom icon → icon shows on profile crest, sidebar avatar, AND navbar.
4. `bannerHidden` → banner gone on profile + hover cards.
5. `profileBgTransparent` → custom `#kyso-global-bg` visible behind profile.
6. Gear/LoR always toggles → buttons visible without hover; off → hover-only restored.
7. `playVanilla` → vanilla frame+text; off → themed pill returns.
8. Play opacity/blur sliders change backdrop in themed mode.
9. Social blur slider 0→20 → social panel blurs; 0 → identical to current (no blur).
10. Existing users (saved settings, no new keys) → unchanged look (defaults preserve).
11. Settings tab title reads "Kyso UI Editor v3.1".

## Out of scope

- Renaming the plugin folder / DataStore key / asset paths.
- Per-element blur for surfaces other than the social panel.
- Onboarding for icon/asset selection (covered by existing Player Assets tab).

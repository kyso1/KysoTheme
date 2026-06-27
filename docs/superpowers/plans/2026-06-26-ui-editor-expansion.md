# KysoTheme UI Editor Expansion v3.2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expose hardcoded `theme.css` behaviors as UI Editor toggles, add per-screen background pickers, add a UI Editor search bar, fix regressed toggles, and clean up the Crests block.

**Architecture:** Approach 1 — relocate each toggleable rule out of `theme.css` into a gated JS apply function that emits CSS only when the setting calls for it (single source of truth). Defaults reproduce today's look exactly. New controls live in the existing 3-tab settings UI (`buildUIEditorPanel` / `buildAssetsPanel`).

**Tech Stack:** Vanilla JS ES modules (no build step), Pengu Loader plugin, League client (CEF/Ember). DataStore JSON blob under `KysoTheme.settings`.

## Global Constraints

- **No JS test runner exists.** The automated gate for every task is `node --check <file>` (syntax) and, for `assets/manifest.json`, `node -e "JSON.parse(require('fs').readFileSync('assets/manifest.json','utf8'));console.log('manifest ok')"`. Behavioral verification is a precise **manual in-client check** the user performs after reloading the client. Do NOT scaffold jest/mocha — it would be dead weight for DOM-coupled plugin code the user tests live.
- **Project rule:** every theme behavior must be a toggle/switch OR a first-run prompt. All new controls are toggles; defaults reproduce the current look, so no welcome-modal change is needed.
- **Do not break existing Player Assets pickers** (background/banner/crest/icon/loading) or any existing UI Editor control.
- **i18n:** every new user-facing string gets a key in BOTH `en` and `pt` translation objects. `t()` falls back to `en`, so es/de/ja/ko inherit English — do not author them.
- **Dynamic-style fences:** each apply function splices a uniquely-named fenced block into the shared `#kyso-theme-dynamic` style via the existing regex-replace pattern. Fence names already in use: `KYSO-HIDE`, `KYSO-ICON`, `KYSO-INTERFACE`. New fence: `KYSO-VIS`. Bucket B uses its own head `<style id="kyso-screenbg-style">`, not a fence.
- **Bucket B OFF state = transparent** (global `#kyso-global-bg` shows through) for all 4 screens. Defaults: champSelect/runes ON, collections/modeSwitcher OFF.
- **Settings key names are binding** — use exactly the keys listed in Task 1; later tasks reference them verbatim.
- All `git commit` messages end with the repo's two trailer lines (Co-Authored-By + Claude-Session), as in recent history. Commit only the files named in each task.

---

## File Structure

- `settingsPage.js` — DEFAULTS, TRANSLATIONS (en+pt), `applyHideOptions` (extend), `applyVisualToggles` (new), `applyInterfaceToggles` (fix gear/LoR), `buildUIEditorPanel` (new sections + search), `buildAssetsPanel` (4 pickers + grey-out), `applyAllSettings` (wire). Large existing file; follow its patterns, do not restructure.
- `assetReplacers.js` — `applyScreenBackgrounds(settings)` (new), `applyScreenBgDisabledUI(panel, settings)` (new helper).
- `main-theme/theme.css` — delete the relocated rules (Buckets A/B/C).
- `assets/manifest.json` — add 4 screen-bg categories; empty `crests`.

---

## Task 1: Foundation — DEFAULTS keys + i18n strings

**Files:**
- Modify: `settingsPage.js` (DEFAULTS object ~line 964-1045; TRANSLATIONS `en` ~line 13+ and `pt` ~line 162+)

**Interfaces:**
- Produces: all new settings keys (consumed by every later task) and all new i18n keys (`t(key)`).

- [ ] **Step 1: Add new keys to DEFAULTS**

Insert these keys into the `DEFAULTS` object (before `hasSeenWelcome`). Keep the existing keys untouched:

```js
  // ── v3.2 Bucket A: hide/show toggles (default = current theme look) ──
  alwaysShowXpRadial: false,        // .summoner-xp-radial-container
  alwaysShowRuneRec: false,         // .rune-recommender-button-component
  alwaysShowDeepLinks: false,       // .deep-links-promo
  showLootBackdrop: false,          // .loot-backdrop
  showIncidentTicker: false,        // .navigation-status-ticker.has-incidents
  showRestrictionWarning: false,    // .player-restriction-warning-icon
  showLoadingSpinner: false,        // .lol-loading-screen-spinner
  showLobbyOverlay: false,          // .lobby-header-overlay
  showNavDividers: false,           // .right-nav-vertical-rule
  showActivityDivider: false,       // .activity-center__tabs_section-divider
  // ── v3.2 Bucket C: visual-effect toggles (default ON = current look) ──
  killClientBlur: true,             // *{backdrop-filter:none} + parties blur collapse
  storeHueOverlay: true,            // store/yourshop accent hue blend
  readyCheckAnim: true,             // ready-check fadeIn animations
  viewportGlow: true,               // #rcp-fe-viewport-root accent drop-shadow
  // ── v3.2 Bucket B: per-screen backgrounds ──
  collectionsBgSource: "local", collectionsBgLocal: "Collections/collections-bg.jpg", collectionsBgWeb: "", collectionsBgEnabled: false,
  champSelectBgSource: "local", champSelectBgLocal: "Runes and Select/champ-select-and-runes.jpg", champSelectBgWeb: "", champSelectBgEnabled: true,
  runesBgSource: "local", runesBgLocal: "Runes and Select/champ-select-and-runes.jpg", runesBgWeb: "", runesBgEnabled: true,
  modeSwitcherBgSource: "local", modeSwitcherBgLocal: "ModeSwitcher/switch.jpg", modeSwitcherBgWeb: "", modeSwitcherBgEnabled: false,
```

- [ ] **Step 2: Add new i18n keys to the `en` object**

Insert into the `en:` translations object (alongside the other `alwaysShow*` keys):

```js
    // v3.2 Bucket A
    alwaysShowXpRadial: "Always show XP radial",
    alwaysShowRuneRec: "Always show rune recommender",
    alwaysShowDeepLinks: "Always show deep-links promo",
    showLootBackdrop: "Show loot backdrop",
    showIncidentTicker: "Show service-incident ticker",
    showRestrictionWarning: "Show profile restriction warning",
    showLoadingSpinner: "Show loading-screen spinner",
    showLobbyOverlay: "Show lobby header overlay",
    showNavDividers: "Show navbar item dividers",
    showActivityDivider: "Show activity-center divider",
    // v3.2 Bucket C
    killClientBlur: "Disable client blur",
    storeHueOverlay: "Store accent tint",
    readyCheckAnim: "Ready-check animations",
    viewportGlow: "Viewport accent glow",
    // v3.2 Bucket B
    screenBgSection: "Screen backgrounds",
    collectionsBgEnabled: "Collections background",
    champSelectBgEnabled: "Champ-select background",
    runesBgEnabled: "Runes background",
    modeSwitcherBgEnabled: "Mode-switcher background",
    collectionsBgLabel: "Collections background",
    champSelectBgLabel: "Champ-select background",
    runesBgLabel: "Runes background",
    modeSwitcherBgLabel: "Mode-switcher background",
    enableInUiEditor: "Enable in UI Editor",
    // v3.2 search
    searchPlaceholder: "Search options…",
    searchNoResults: "No results",
    moreVisSection: "More visibility",
    effectsSection: "Visual effects",
```

- [ ] **Step 3: Add the same keys to the `pt` object**

```js
    // v3.2 Bucket A
    alwaysShowXpRadial: "Sempre mostrar radial de XP",
    alwaysShowRuneRec: "Sempre mostrar recomendador de runas",
    alwaysShowDeepLinks: "Sempre mostrar promo de deep-links",
    showLootBackdrop: "Mostrar fundo do saque",
    showIncidentTicker: "Mostrar aviso de incidente do serviço",
    showRestrictionWarning: "Mostrar aviso de restrição no perfil",
    showLoadingSpinner: "Mostrar spinner da tela de loading",
    showLobbyOverlay: "Mostrar overlay do cabeçalho da lobby",
    showNavDividers: "Mostrar divisórias da navbar",
    showActivityDivider: "Mostrar divisória do activity-center",
    // v3.2 Bucket C
    killClientBlur: "Desativar blur do cliente",
    storeHueOverlay: "Tom de destaque na loja",
    readyCheckAnim: "Animações do ready-check",
    viewportGlow: "Brilho de destaque do viewport",
    // v3.2 Bucket B
    screenBgSection: "Fundos de tela",
    collectionsBgEnabled: "Fundo de Coleções",
    champSelectBgEnabled: "Fundo de Seleção de campeão",
    runesBgEnabled: "Fundo de Runas",
    modeSwitcherBgEnabled: "Fundo do seletor de modo",
    collectionsBgLabel: "Fundo de Coleções",
    champSelectBgLabel: "Fundo de Seleção de campeão",
    runesBgLabel: "Fundo de Runas",
    modeSwitcherBgLabel: "Fundo do seletor de modo",
    enableInUiEditor: "Ative no UI Editor",
    // v3.2 search
    searchPlaceholder: "Pesquisar opções…",
    searchNoResults: "Nenhum resultado",
    moreVisSection: "Mais visibilidade",
    effectsSection: "Efeitos visuais",
```

- [ ] **Step 4: Verify syntax**

Run: `node --check settingsPage.js`
Expected: no output, exit 0.

- [ ] **Step 5: Commit**

```bash
git add settingsPage.js
git commit -m "feat(settings): v3.2 DEFAULTS keys + en/pt i18n for UI Editor expansion

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01GS6nD5Q3i4GdahKR43K7hG"
```

---

## Task 2: Bucket A — extend `applyHideOptions`, relocate theme.css, add UI Editor section

**Files:**
- Modify: `settingsPage.js` — `applyHideOptions` (~line 1778-1892); `buildUIEditorPanel` (~line 3513-3659)
- Modify: `main-theme/theme.css` — delete relocated rules

**Interfaces:**
- Consumes: Task 1 settings keys + i18n.
- Produces: `applyHideOptions` now emits Bucket A blocks; UI Editor "More visibility" section with toggle ids `kyso-ue-xp-radial`, `kyso-ue-rune-rec`, `kyso-ue-deeplinks`, `kyso-ue-loot`, `kyso-ue-incident`, `kyso-ue-restriction`, `kyso-ue-loading-spinner`, `kyso-ue-lobby-overlay`, `kyso-ue-nav-dividers`, `kyso-ue-activity-divider`.

- [ ] **Step 1: Append Bucket A blocks inside `applyHideOptions`**

Add the following just before the `// Substitui apenas o bloco de hide options` comment (after the existing `if (settings.hideSocialPanel)…else if (settings.hideSocialOnly)…` block, still inside the function so it joins `css`):

```js
  // ── v3.2 Bucket A: hover-fade items (OFF = fade until hover; ON = always) ──
  if (!(settings.alwaysShowXpRadial || _showAll)) {
    css += `.summoner-xp-radial-container { opacity: 0 !important; transition: 0.2s !important; }
.summoner-xp-radial-container:hover { opacity: 1 !important; transition: 0.2s !important; }
`;
  }
  if (!(settings.alwaysShowRuneRec || _showAll)) {
    css += `.rune-recommender-button-component { opacity: 0 !important; transition: 0.2s !important; }
.rune-recommender-button-component:hover { opacity: 1 !important; transition: 0.2s !important; }
`;
  }
  if (!(settings.alwaysShowDeepLinks || _showAll)) {
    css += `.deep-links-promo { opacity: 0 !important; transition: 0.2s !important; }
.deep-links-promo:hover { opacity: 1 !important; transition: 0.2s !important; }
`;
  }
  // ── v3.2 Bucket A: force-hidden items (OFF = hidden; ON = shown) ──
  if (!settings.showLootBackdrop) {
    css += `.loot-backdrop { opacity: 0 !important; }\n`;
  }
  if (!settings.showIncidentTicker) {
    css += `.navigation-status-ticker.has-incidents { visibility: hidden !important; }\n`;
  }
  if (!settings.showRestrictionWarning) {
    css += `.player-restriction-info-component .player-restriction-warning-icon { visibility: hidden !important; }\n`;
  }
  if (!settings.showLoadingSpinner) {
    css += `.lol-loading-screen-spinner { visibility: hidden !important; }\n`;
  }
  if (!settings.showLobbyOverlay) {
    css += `.v2-header-component .lobby-header-overlay { display: none !important; }\n`;
  }
  if (!settings.showNavDividers) {
    css += `.right-nav-vertical-rule { display: none !important; }\n`;
  }
  if (!settings.showActivityDivider) {
    css += `#activity-center .activity-center__tabs_section-divider { visibility: hidden !important; }\n`;
  }
```

- [ ] **Step 2: Delete the relocated rules from `theme.css`**

Delete each of these exact blocks (they now live in `applyHideOptions`):

| theme.css block to delete | Now emitted by |
|---|---|
| `.summoner-xp-radial-container { opacity: 0; transition: 0.2s !important; }` + its `:hover` (the hover-fade comment block ~lines 93-100) | `alwaysShowXpRadial` |
| `.rune-recommender-button-component { opacity: 0; … }` + `:hover` (~lines 177-185, keep the comment line `/* changes auto rune to hover mode */` only if you also remove it) | `alwaysShowRuneRec` |
| `.deep-links-promo { opacity: 0; … }` + `:hover` (~lines 119-126) | `alwaysShowDeepLinks` |
| `.loot-backdrop { opacity: 0 !important; }` (~lines 173-175) | `showLootBackdrop` |
| `.navigation-status-ticker.has-incidents { visibility: hidden !important; }` (~lines 229-231) | `showIncidentTicker` |
| `.player-restriction-info-component .player-restriction-warning-icon { visibility: hidden; }` + its comment (~lines 331-334) | `showRestrictionWarning` |
| `.lol-loading-screen-spinner { visibility: hidden !important; }` (~lines 357-359) | `showLoadingSpinner` |
| `.v2-header-component .lobby-header-overlay { display: none !important; }` + `/* Lobby blurs.*/` comment (~lines 819-822) | `showLobbyOverlay` |
| BOTH `.right-nav-vertical-rule { visibility: hidden !important; }` (~lines 235-237) AND `.right-nav-vertical-rule { display: none !important; }` (~lines 453-455) | `showNavDividers` |
| `#activity-center .activity-center__tabs_section-divider { visibility: hidden !important; }` (~lines 763-765) | `showActivityDivider` |

Do NOT delete: `.right-nav-vertical-rule` from the `transition:` group (~line 647) — that is a transition declaration, not a hide rule; leave it. Do NOT delete `.summoner-level-icon`/`.filled.xp-ring` color rules.

- [ ] **Step 3: Add the "More visibility" section to `buildUIEditorPanel`**

In the `panel.innerHTML` template, add a new `<section>` after the existing Visibility section (the one ending at `${tog("kyso-ue-enable-hide-social-btn", "enableHideSocialBtn")}` `</section>`):

```js
    <section class="kyso-settings-section">
      <h3 class="kyso-settings-section-title"><span>${t("moreVisSection")}</span></h3>
      ${tog("kyso-ue-xp-radial", "alwaysShowXpRadial")}
      ${tog("kyso-ue-rune-rec", "alwaysShowRuneRec")}
      ${tog("kyso-ue-deeplinks", "alwaysShowDeepLinks")}
      ${tog("kyso-ue-loot", "showLootBackdrop")}
      ${tog("kyso-ue-incident", "showIncidentTicker")}
      ${tog("kyso-ue-restriction", "showRestrictionWarning")}
      ${tog("kyso-ue-loading-spinner", "showLoadingSpinner")}
      ${tog("kyso-ue-lobby-overlay", "showLobbyOverlay")}
      ${tog("kyso-ue-nav-dividers", "showNavDividers")}
      ${tog("kyso-ue-activity-divider", "showActivityDivider")}
    </section>
```

- [ ] **Step 4: Add the binds**

In `buildUIEditorPanel`, after the existing `// ── Granular hover toggles ──` bind block, add:

```js
  // ── v3.2 Bucket A ──
  bindToggle("#kyso-ue-xp-radial", "alwaysShowXpRadial", (s) => applyHideOptions(s));
  bindToggle("#kyso-ue-rune-rec", "alwaysShowRuneRec", (s) => applyHideOptions(s));
  bindToggle("#kyso-ue-deeplinks", "alwaysShowDeepLinks", (s) => applyHideOptions(s));
  bindToggle("#kyso-ue-loot", "showLootBackdrop", (s) => applyHideOptions(s));
  bindToggle("#kyso-ue-incident", "showIncidentTicker", (s) => applyHideOptions(s));
  bindToggle("#kyso-ue-restriction", "showRestrictionWarning", (s) => applyHideOptions(s));
  bindToggle("#kyso-ue-loading-spinner", "showLoadingSpinner", (s) => applyHideOptions(s));
  bindToggle("#kyso-ue-lobby-overlay", "showLobbyOverlay", (s) => applyHideOptions(s));
  bindToggle("#kyso-ue-nav-dividers", "showNavDividers", (s) => applyHideOptions(s));
  bindToggle("#kyso-ue-activity-divider", "showActivityDivider", (s) => applyHideOptions(s));
```

- [ ] **Step 5: Verify syntax**

Run: `node --check settingsPage.js`
Expected: no output, exit 0.

- [ ] **Step 6: Manual in-client check**

Reload the client. Open Settings → UI Editor → "More visibility". Toggle "Show service-incident ticker" — confirm the incident ticker appears/disappears. Toggle "Always show rune recommender" on a champ screen — confirm it stops fading. Confirm default state matches the pre-change look (all faded/hidden).

- [ ] **Step 7: Commit**

```bash
git add settingsPage.js main-theme/theme.css
git commit -m "feat(ui-editor): Bucket A hide/show toggles relocated to applyHideOptions

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01GS6nD5Q3i4GdahKR43K7hG"
```

---

## Task 3: Regression fix — gear/LoR OFF-fade relocation + XP-ring selector

**Files:**
- Modify: `settingsPage.js` — `applyInterfaceToggles` (~line 2018-2039); `applyHideOptions` xp-ring block (~line 1812-1818)
- Modify: `main-theme/theme.css` — delete gear/LoR/skin-picker hover-fade rules

**Interfaces:**
- Consumes: existing `gearAlwaysVisible`, `lorAlwaysVisible`, `alwaysShowXpRing`.
- Produces: gear/LoR now emit BOTH states from JS; deep-links decoupled from LoR (handled by Task 2 `alwaysShowDeepLinks`).

**Root cause:** `theme.css` still hardcodes the OFF hover-fade for `.style-profile-skin-picker-button` / `.launch-lor-button-container` / `.deep-links-promo`, which fights the JS toggles. `.xp-ring`'s restore selector uses a strict `>` chain that may not match the live DOM.

- [ ] **Step 1: Replace the gear/LoR branches in `applyInterfaceToggles`**

Replace these existing lines:

```js
  if (settings.gearAlwaysVisible) {
    block += `.style-profile-skin-picker-button { opacity: 1 !important; }\n`;
  }
  if (settings.lorAlwaysVisible) {
    block += `.launch-lor-button-container, .deep-links-promo { opacity: 1 !important; }\n`;
  }
```

with (emit OFF fade too; deep-links removed — now its own Bucket A toggle):

```js
  if (settings.gearAlwaysVisible) {
    block += `.style-profile-skin-picker-button { opacity: 1 !important; }\n`;
  } else {
    block += `.style-profile-skin-picker-button { opacity: 0; transition: 0.2s !important; }
.style-profile-skin-picker-button:hover { opacity: 1; transition: 0.2s !important; }
`;
  }
  if (settings.lorAlwaysVisible) {
    block += `.launch-lor-button-container { opacity: 1 !important; }\n`;
  } else {
    block += `.launch-lor-button-container { opacity: 0; transition: 0.2s !important; }
.launch-lor-button-container:hover { opacity: 1; transition: 0.2s !important; }
`;
  }
```

- [ ] **Step 2: Fix the XP-ring restore selector in `applyHideOptions`**

Replace the existing `alwaysShowXpRing` block:

```js
  if (!(settings.alwaysShowXpRing || _showAll)) {
    css += `.xp-ring { opacity: 0 !important; transition: 0.2s !important; }
.identity-icon:hover > .summoner-level-icon > .xp-ring {
  opacity: 1 !important; transition: 0.2s !important;
}
`;
  }
```

with a descendant (non-strict) hover selector that survives intermediate wrappers:

```js
  if (!(settings.alwaysShowXpRing || _showAll)) {
    css += `.xp-ring { opacity: 0 !important; transition: 0.2s !important; }
.identity-icon:hover .xp-ring,
.summoner-level-icon:hover .xp-ring {
  opacity: 1 !important; transition: 0.2s !important;
}
`;
  }
```

- [ ] **Step 3: Delete the gear/LoR/skin-picker hover-fade rules from `theme.css`**

Delete these exact blocks (now emitted by `applyInterfaceToggles`):

```css
.style-profile-skin-picker-button {
  opacity: 0;
  transition: 0.2s !important;
}
.style-profile-skin-picker-button:hover {
  opacity: 1;
  transition: 0.2s !important;
}
```

```css
.launch-lor-button-container {
  opacity: 0;
  transition: 0.2s !important;
}
.launch-lor-button-container:hover {
  opacity: 1;
  transition: 0.2s !important;
}
```

(The `.deep-links-promo` block was already removed in Task 2. The `/* Lor Button Settings */` comment may be removed.)

- [ ] **Step 4: Verify syntax**

Run: `node --check settingsPage.js`
Expected: no output, exit 0.

- [ ] **Step 5: Manual in-client check**

Reload. UI Editor: toggle "Always show XP ring" → the social-sidebar level ring should stay visible when ON and fade-until-hover when OFF (this is the reported regression — confirm it works again). Toggle the gear (profile skin-picker) and LoR buttons (gear/LoR live in the Interface section) → confirm both ON (always) and OFF (fade) behave correctly with no double-rule flicker.

- [ ] **Step 6: Commit**

```bash
git add settingsPage.js main-theme/theme.css
git commit -m "fix(ui-editor): single-source gear/LoR/XP-ring toggles; fix XP-ring hover

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01GS6nD5Q3i4GdahKR43K7hG"
```

---

## Task 4: Bucket C — `applyVisualToggles` + relocate effects + UI Editor section

**Files:**
- Modify: `settingsPage.js` — new `applyVisualToggles` (place after `applyInterfaceToggles`, ~line 2040); `applyAllSettings` (~line 2178); `buildUIEditorPanel` markup + binds
- Modify: `main-theme/theme.css` — delete relocated effect rules

**Interfaces:**
- Consumes: `killClientBlur`, `storeHueOverlay`, `readyCheckAnim`, `viewportGlow` (Task 1).
- Produces: `applyVisualToggles(settings)` writing fence `KYSO-VIS`; UI Editor "Visual effects" section ids `kyso-ue-kill-blur`, `kyso-ue-store-hue`, `kyso-ue-readycheck-anim`, `kyso-ue-viewport-glow`.

- [ ] **Step 1: Add `applyVisualToggles`**

Insert after the `applyInterfaceToggles` function:

```js
// v3.2 Bucket C — visual effects relocated from theme.css. Each emits its rule
// when ON (default) and nothing when OFF (native client look). Fence: KYSO-VIS.
function applyVisualToggles(settings) {
  const style = getOrCreateDynamicStyle();
  let block = "/* KYSO-VIS-START */\n";
  if (settings.killClientBlur) {
    block += `*, *::before, *::after { backdrop-filter: none !important; -webkit-backdrop-filter: none !important; }
.parties-view .parties-background { height: 0px !important; }
.v2-lobby-root-component .navbar-blur { background: none !important; backdrop-filter: none !important; }
.rcp-fe-lol-navigation-app .navbar_backdrop { backdrop-filter: blur(0px) !important; }
`;
  }
  if (settings.storeHueOverlay) {
    block += `.yourshop-root { position: relative; isolation: isolate; }
.yourshop-root:before { content: ""; position: absolute; top: 0; left: 0; width: 100%; height: 100%; mix-blend-mode: hue; background-color: var(--kyso-accent) !important; z-index: 1; }
.yourshop-content-wrapper { position: relative; z-index: 2; }
.store-backdrop { position: relative; isolation: isolate; }
.store-backdrop:before { content: ""; position: absolute; top: 0; left: 0; width: 100%; height: 100%; mix-blend-mode: hue; background-color: var(--kyso-accent) !important; z-index: -1; }
.__rcp-fe-lol-store { position: relative; z-index: 1; }
`;
  }
  if (settings.readyCheckAnim) {
    block += `.ready-check-state-machine-timer { animation-name: fadeIn; animation-duration: 1s; filter: hue-rotate(0deg) !important; }
.ready-check-timer, .ready-check-timer.ember-view,
.ready-check-root-element, .ready-check-root-element.ember-view,
.fake-application-template { animation-name: fadeIn; animation-duration: 1s; }
`;
  }
  if (settings.viewportGlow) {
    block += `#rcp-fe-viewport-root { filter: drop-shadow(1px 1px 1px var(--kyso-accent-glow)) !important; }\n`;
  }
  block += "/* KYSO-VIS-END */\n";

  const current = style.textContent || "";
  const without = current.replace(
    /\/\* KYSO-VIS-START \*\/[\s\S]*?\/\* KYSO-VIS-END \*\//g,
    "",
  );
  style.textContent = without + block;
}
```

- [ ] **Step 2: Wire into `applyAllSettings`**

In `applyAllSettings`, after the `applyInterfaceToggles(merged);` line, add:

```js
  applyVisualToggles(merged);
```

- [ ] **Step 3: Delete the relocated effect rules from `theme.css`**

Delete these blocks (now emitted by `applyVisualToggles`):

| theme.css block | gated by |
|---|---|
| `*, *::before, *::after { backdrop-filter: none …}` (~lines 526-533, keep the comment if desired) | `killClientBlur` |
| `.parties-view .parties-background { height: 0px !important; }` (~lines 537-539) | `killClientBlur` |
| `.v2-lobby-root-component .navbar-blur { … }` (~lines 540-543) | `killClientBlur` |
| `.rcp-fe-lol-navigation-app .navbar_backdrop { backdrop-filter: blur(0px) !important; }` (~lines 653-655) | `killClientBlur` |
| `.yourshop-root`, `.yourshop-root:before`, `.yourshop-content-wrapper` (~lines 281-299) | `storeHueOverlay` |
| `.store-backdrop`, `.store-backdrop:before`, `.__rcp-fe-lol-store` (~lines 301-320) | `storeHueOverlay` |
| `.ready-check-state-machine-timer` + all `.ready-check-*` / `.fake-application-template` animation rules (~lines 201-226) | `readyCheckAnim` |
| ONLY the `filter: drop-shadow(... --kyso-accent-glow)` rule on `#rcp-fe-viewport-root` (~lines 560-568) | `viewportGlow` |

Keep `@keyframes fadeIn` / `@-webkit-keyframes fadeIn` (used elsewhere). Keep the SECOND `#rcp-fe-viewport-root` rule (`background: transparent`) — only remove the drop-shadow one. Keep `.parties-status-card-bg-container video` display rules.

- [ ] **Step 4: Add the "Visual effects" section + binds to `buildUIEditorPanel`**

Markup (new `<section>` after the "More visibility" section from Task 2):

```js
    <section class="kyso-settings-section">
      <h3 class="kyso-settings-section-title"><span>${t("effectsSection")}</span></h3>
      ${tog("kyso-ue-kill-blur", "killClientBlur")}
      ${tog("kyso-ue-store-hue", "storeHueOverlay")}
      ${tog("kyso-ue-readycheck-anim", "readyCheckAnim")}
      ${tog("kyso-ue-viewport-glow", "viewportGlow")}
    </section>
```

Binds (after the Task 2 Bucket A binds):

```js
  // ── v3.2 Bucket C ──
  bindToggle("#kyso-ue-kill-blur", "killClientBlur", (s) => applyVisualToggles(s));
  bindToggle("#kyso-ue-store-hue", "storeHueOverlay", (s) => applyVisualToggles(s));
  bindToggle("#kyso-ue-readycheck-anim", "readyCheckAnim", (s) => applyVisualToggles(s));
  bindToggle("#kyso-ue-viewport-glow", "viewportGlow", (s) => applyVisualToggles(s));
```

- [ ] **Step 5: Verify syntax**

Run: `node --check settingsPage.js`
Expected: no output, exit 0.

- [ ] **Step 6: Manual in-client check**

Reload. With defaults, the look is unchanged (blur killed, store tinted, ready-check animates, viewport glows). UI Editor → Visual effects: toggle "Disable client blur" OFF → client blur returns. Toggle it back ON → blur gone. Confirm store tint and viewport glow toggle off/on.

- [ ] **Step 7: Commit**

```bash
git add settingsPage.js main-theme/theme.css
git commit -m "feat(ui-editor): Bucket C visual-effect toggles (applyVisualToggles)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01GS6nD5Q3i4GdahKR43K7hG"
```

---

## Task 5: Bucket B — `applyScreenBackgrounds` + manifest categories + relocate theme.css

**Files:**
- Modify: `assetReplacers.js` — new `applyScreenBackgrounds(settings)` (export); new `applyScreenBgDisabledUI(panel, settings)` (export)
- Modify: `settingsPage.js` — `applyAllSettings` wire; import the new fn if not namespace-imported (it is: `assetReplacers.*`)
- Modify: `assets/manifest.json` — add 4 categories
- Modify: `main-theme/theme.css` — delete per-screen bg rules

**Interfaces:**
- Consumes: `collectionsBg*`, `champSelectBg*`, `runesBg*`, `modeSwitcherBg*` keys (Task 1).
- Produces: `assetReplacers.applyScreenBackgrounds(settings)` and `assetReplacers.applyScreenBgDisabledUI(panel, settings)`. `applyScreenBackgrounds` resolves each screen's source/local/web triple (web → raw url; local → `//plugins/KysoTheme/assets/<path>`) and injects `<style id="kyso-screenbg-style">`.

- [ ] **Step 1: Add the manifest categories**

In `assets/manifest.json`, add these 4 arrays inside `categories` (paths verified against the existing `backgrounds` list):

```json
    "collectionsBackgrounds": [
      { "label": "Default", "path": "Collections/collections-bg.jpg" },
      { "label": "Alt 22", "path": "Collections/collections-bg22.jpg" }
    ],
    "champSelectBackgrounds": [
      { "label": "Default", "path": "Runes and Select/champ-select-and-runes.jpg" },
      { "label": "Alt 1", "path": "Runes and Select/1.jpg" }
    ],
    "runesBackgrounds": [
      { "label": "Default", "path": "Runes and Select/champ-select-and-runes.jpg" },
      { "label": "Alt 1", "path": "Runes and Select/1.jpg" }
    ],
    "modeSwitcherBackgrounds": [
      { "label": "Default", "path": "ModeSwitcher/switch.jpg" },
      { "label": "Alt 1", "path": "ModeSwitcher/switch1.jpg" }
    ],
```

- [ ] **Step 2: Add `applyScreenBackgrounds` to `assetReplacers.js`**

Reuse the file's existing asset-URL resolution if present; otherwise inline this self-contained resolver (mirrors `resolveAsset`/`pluginAsset` in settingsPage.js — keep it local to avoid a cross-module import):

```js
const _SCREENBG_BASE = "//plugins/KysoTheme/assets/";
function _screenBgUrl(rel) {
  if (!rel) return "";
  const s = String(rel);
  if (/^(https?:)?\/\//.test(s) || s.startsWith("data:")) return s;
  return _SCREENBG_BASE + s.replace(/^\/+/, "");
}
function _resolveScreenBg(cat, s) {
  if (s[cat + "Source"] === "web") return s[cat + "Web"] || "";
  return _screenBgUrl(s[cat + "Local"] || "");
}

// v3.2 Bucket B — per-screen backgrounds. Each screen ON = its resolved image;
// OFF = transparent so the global #kyso-global-bg shows through. One head style.
export function applyScreenBackgrounds(settings) {
  let style = document.querySelector("#kyso-screenbg-style");
  if (!style) {
    style = document.createElement("style");
    style.id = "kyso-screenbg-style";
    document.head.appendChild(style);
  }
  const bgCover = (url) =>
    `background-image: url("${url}") !important; background-size: cover !important; background-position: center center !important; background-repeat: no-repeat !important;`;
  const transparent = `background: transparent !important; background-image: none !important;`;
  let css = "";

  // Collections
  if (settings.collectionsBgEnabled) {
    const u = _resolveScreenBg("collectionsBg", settings);
    css += `.collections-application, .collections-routes { ${u ? bgCover(u) : transparent} }\n`;
  } else {
    css += `.collections-application, .collections-routes { ${transparent} }\n`;
  }

  // Champ select
  if (settings.champSelectBgEnabled) {
    const u = _resolveScreenBg("champSelectBg", settings);
    css += `.champion-select { ${u ? bgCover(u) : transparent} }\n`;
  } else {
    css += `.champion-select { ${transparent} }\n`;
  }

  // Runes
  if (settings.runesBgEnabled) {
    const u = _resolveScreenBg("runesBg", settings);
    css += `.perks-body-content { ${u ? bgCover(u) : transparent} }\n`;
  } else {
    css += `.perks-body-content { ${transparent} }\n`;
  }

  // Mode switcher (default OFF/transparent; ON shows image at full opacity)
  if (settings.modeSwitcherBgEnabled) {
    const u = _resolveScreenBg("modeSwitcherBg", settings);
    css += `:host .lol-uikit-background-switcher-image, .parties-view .parties-background .uikit-background-switcher { content: url("${u}") !important; opacity: 1 !important; width: auto !important; }\n`;
  } else {
    css += `:host .lol-uikit-background-switcher-image, .parties-view .parties-background .uikit-background-switcher { opacity: 0 !important; }\n`;
  }

  style.textContent = css;
}
```

- [ ] **Step 3: Add `applyScreenBgDisabledUI` to `assetReplacers.js`**

```js
// v3.2 — greys out an Assets-tab screen-bg picker when its UI Editor toggle is
// OFF, with a hint pointing to the UI Editor. `panel` = the Assets panel root.
const _SCREENBG_CATS = ["collectionsBg", "champSelectBg", "runesBg", "modeSwitcherBg"];
export function applyScreenBgDisabledUI(panel, settings) {
  if (!panel) return;
  _SCREENBG_CATS.forEach((cat) => {
    const block = panel.querySelector(`.kyso-asset-section[data-cat="${cat}"]`);
    if (!block) return;
    const enabled = !!settings[cat + "Enabled"];
    block.classList.toggle("kyso-asset-section--disabled", !enabled);
  });
}
```

- [ ] **Step 4: Wire into `applyAllSettings` (settingsPage.js)**

After `assetReplacers.applyLoadingScreen({…});`, add:

```js
  assetReplacers.applyScreenBackgrounds(merged);
```

- [ ] **Step 5: Delete the per-screen bg rules from `theme.css`**

Delete (now emitted by `applyScreenBackgrounds`):

| theme.css block | screen |
|---|---|
| `.collections-application { … background-image: …collections-bg.jpg … }`, `.collections-application:before { … }`, `.collections-routes { … background-image: …collections-bg.jpg … }` (~lines 252-278) | Collections |
| `.champion-select { background-image: …champ-select-and-runes.jpg … }` ONLY (~lines 371-376) — keep the vignette/darken rules below it | Champ-select |
| `.perks-body-content { background-image: …champ-select-and-runes.jpg … }` (~lines 393-398) | Runes |
| `:host .lol-uikit-background-switcher-image { content: url(switch.jpg); … opacity: 0 … }` and `.parties-view .parties-background .uikit-background-switcher { content: url(switch.jpg); … opacity: 0 … }` (~lines 336-350) | Mode-switcher |

Keep `.collections-sub-nav-container`, `.background-vignette-container*`, `.champ-select-bg-darken`, `.lol-uikit-background-switcher-image.none.transition` — those are layout/vignette, not the bg image.

- [ ] **Step 6: Verify syntax + manifest**

Run: `node --check assetReplacers.js`
Expected: no output, exit 0.
Run: `node -e "JSON.parse(require('fs').readFileSync('assets/manifest.json','utf8'));console.log('manifest ok')"`
Expected: `manifest ok`.

- [ ] **Step 7: Manual in-client check**

Reload. Champ-select & Runes screens still show their theme JPG (default ON). Collections & Mode-switcher now show the global background through them (default OFF/transparent). No console errors.

- [ ] **Step 8: Commit**

```bash
git add assetReplacers.js settingsPage.js assets/manifest.json main-theme/theme.css
git commit -m "feat(assets): per-screen backgrounds via applyScreenBackgrounds + manifest

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01GS6nD5Q3i4GdahKR43K7hG"
```

---

## Task 6: Bucket B UI — Assets pickers + UI Editor toggles + grey-out

**Files:**
- Modify: `settingsPage.js` — `buildAssetsPanel` (add 4 blocks + ASSET_APPLIERS entries + call grey-out); `buildUIEditorPanel` (toggles + binds)
- Modify: `utilsCss/ThemeSettings.css` — add `.kyso-asset-section--disabled` styling

**Interfaces:**
- Consumes: `assetReplacers.applyScreenBackgrounds`, `assetReplacers.applyScreenBgDisabledUI` (Task 5); manifest categories (Task 5).
- Produces: UI Editor "Screen backgrounds" toggles `kyso-ue-bg-collections`, `kyso-ue-bg-champselect`, `kyso-ue-bg-runes`, `kyso-ue-bg-modeswitch`.

- [ ] **Step 1: Add the 4 Assets-tab picker blocks**

In `buildAssetsPanel`'s `panel.innerHTML`, after the loading-icon block (`${buildAssetBlock("loadingIcon", …)}`) and before the footer, add:

```js
    <h3 class="kyso-settings-section-title" style="margin-top:18px;"><span>${t("screenBgSection")}</span></h3>
    ${buildAssetBlock("collectionsBg", "collectionsBgLabel", manifest.categories.collectionsBackgrounds || [], settings, { icon: ICONS.picture })}
    ${buildAssetBlock("champSelectBg", "champSelectBgLabel", manifest.categories.champSelectBackgrounds || [], settings, { icon: ICONS.picture })}
    ${buildAssetBlock("runesBg", "runesBgLabel", manifest.categories.runesBackgrounds || [], settings, { icon: ICONS.picture })}
    ${buildAssetBlock("modeSwitcherBg", "modeSwitcherBgLabel", manifest.categories.modeSwitcherBackgrounds || [], settings, { icon: ICONS.picture })}
```

- [ ] **Step 2: Add ASSET_APPLIERS entries**

In `buildAssetsPanel`, extend the `ASSET_APPLIERS` map so the picker source-toggle / thumb-click / upload handlers apply the new screens:

```js
    collectionsBg: (s) => assetReplacers.applyScreenBackgrounds(s),
    champSelectBg: (s) => assetReplacers.applyScreenBackgrounds(s),
    runesBg:       (s) => assetReplacers.applyScreenBackgrounds(s),
    modeSwitcherBg:(s) => assetReplacers.applyScreenBackgrounds(s),
```

- [ ] **Step 3: Apply grey-out on Assets panel build**

At the end of `buildAssetsPanel`, before `return panel;`, add:

```js
  assetReplacers.applyScreenBgDisabledUI(panel, settings);
```

- [ ] **Step 4: Add the UI Editor "Screen backgrounds" toggle section**

In `buildUIEditorPanel` markup, add a new `<section>` (after "Visual effects" from Task 4):

```js
    <section class="kyso-settings-section">
      <h3 class="kyso-settings-section-title"><span>${t("screenBgSection")}</span></h3>
      ${tog("kyso-ue-bg-collections", "collectionsBgEnabled")}
      ${tog("kyso-ue-bg-champselect", "champSelectBgEnabled")}
      ${tog("kyso-ue-bg-runes", "runesBgEnabled")}
      ${tog("kyso-ue-bg-modeswitch", "modeSwitcherBgEnabled")}
    </section>
```

- [ ] **Step 5: Add the toggle binds (apply bg + refresh grey-out on the live Assets panel)**

In `buildUIEditorPanel` binds:

```js
  // ── v3.2 Bucket B screen-background enable toggles ──
  const _bgRefresh = (s) => {
    applyScreenBackgrounds(s);
    const assetsPanel = document.querySelector(".kyso-assets-panel");
    if (assetsPanel) applyScreenBgDisabledUI(assetsPanel, s);
  };
  bindToggle("#kyso-ue-bg-collections", "collectionsBgEnabled", _bgRefresh);
  bindToggle("#kyso-ue-bg-champselect", "champSelectBgEnabled", _bgRefresh);
  bindToggle("#kyso-ue-bg-runes", "runesBgEnabled", _bgRefresh);
  bindToggle("#kyso-ue-bg-modeswitch", "modeSwitcherBgEnabled", _bgRefresh);
```

Note: `applyScreenBackgrounds` and `applyScreenBgDisabledUI` are on the `assetReplacers` namespace import. Verify the top-of-file import. If `buildUIEditorPanel` references bare names elsewhere, use `assetReplacers.applyScreenBackgrounds` / `assetReplacers.applyScreenBgDisabledUI` here to match. (The file imports `* as assetReplacers` and also destructures some names like `applyIcon`; check which is in scope and use that form consistently.)

- [ ] **Step 6: Add disabled styling to `utilsCss/ThemeSettings.css`**

```css
/* v3.2 — screen-bg picker disabled when its UI Editor toggle is OFF */
.kyso-asset-section--disabled {
  position: relative;
  opacity: 0.45;
  pointer-events: none;
}
.kyso-asset-section--disabled::after {
  content: attr(data-disabled-hint);
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: #c8a040;
  background: rgba(0, 0, 0, 0.55);
  pointer-events: none;
}
```

And in `applyScreenBgDisabledUI` (assetReplacers.js, Task 5 Step 3), set the hint text so the `::after` shows the localized string — update the helper to also set the attribute:

```js
    block.classList.toggle("kyso-asset-section--disabled", !enabled);
    block.setAttribute("data-disabled-hint", enabled ? "" : (settings._enableHint || "Enable in UI Editor"));
```

And at the call sites pass the localized hint: in `buildAssetsPanel` Step 3 and the UI Editor `_bgRefresh`, set `settings._enableHint = t("enableInUiEditor")` on the object before calling (or pass `{ ...settings, _enableHint: t("enableInUiEditor") }`). Use: `assetReplacers.applyScreenBgDisabledUI(panel, { ...settings, _enableHint: t("enableInUiEditor") });`

- [ ] **Step 7: Verify syntax**

Run: `node --check settingsPage.js && node --check assetReplacers.js`
Expected: no output, exit 0.

- [ ] **Step 8: Manual in-client check**

Reload. Assets tab now shows 4 "Screen backgrounds" pickers; Collections & Mode-switcher pickers are greyed with "Ative no UI Editor". UI Editor → Screen backgrounds: turn Collections ON → the Assets Collections picker un-greys and the Collections screen shows its JPG; pick the Alt thumbnail → screen updates. Turn it OFF → picker greys again, screen goes transparent (global bg shows).

- [ ] **Step 9: Commit**

```bash
git add settingsPage.js assetReplacers.js utilsCss/ThemeSettings.css
git commit -m "feat(ui-editor): screen-bg pickers + on/off toggles + grey-out link

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01GS6nD5Q3i4GdahKR43K7hG"
```

---

## Task 7: Search bar in the UI Editor

**Files:**
- Modify: `settingsPage.js` — `buildUIEditorPanel` (search input + filter; tag rows)
- Modify: `utilsCss/ThemeSettings.css` — search input styling

**Interfaces:**
- Consumes: nothing new.
- Produces: live row filter scoped to the UI Editor panel.

- [ ] **Step 1: Prepend the search input to the UI Editor panel**

At the very start of `buildUIEditorPanel`'s `panel.innerHTML` (before the first `<section>`), add:

```js
    <div class="kyso-ue-search">
      <input id="kyso-ue-search-input" class="kyso-input" type="text" placeholder="${t("searchPlaceholder")}" autocomplete="off">
      <button id="kyso-ue-search-clear" class="kyso-ue-search-clear" type="button" aria-label="clear">×</button>
    </div>
    <div id="kyso-ue-search-empty" class="kyso-ue-search-empty" style="display:none;">${t("searchNoResults")}</div>
```

- [ ] **Step 2: Add the filter logic (end of `buildUIEditorPanel`, before `return panel;`)**

```js
  // ── v3.2 search filter (scoped to this panel) ──
  const searchInput = panel.querySelector("#kyso-ue-search-input");
  const searchClear = panel.querySelector("#kyso-ue-search-clear");
  const searchEmpty = panel.querySelector("#kyso-ue-search-empty");
  const searchRows = Array.from(panel.querySelectorAll(".kyso-settings-row"));
  // Tag each row with its lowercased label text once.
  searchRows.forEach((row) => {
    const lbl = row.querySelector(".kyso-label");
    row.dataset.kysoSearch = (lbl ? lbl.textContent : "").toLowerCase();
  });
  const sections = Array.from(panel.querySelectorAll(".kyso-settings-section"));
  const runSearch = (qRaw) => {
    const q = (qRaw || "").trim().toLowerCase();
    let anyVisible = false;
    searchRows.forEach((row) => {
      const match = !q || row.dataset.kysoSearch.indexOf(q) !== -1;
      row.style.display = match ? "" : "none";
      if (match) anyVisible = true;
    });
    // Hide a section header whose rows are all hidden.
    sections.forEach((sec) => {
      const visibleRow = sec.querySelector(".kyso-settings-row:not([style*='display: none'])");
      const header = sec.querySelector(".kyso-settings-section-title");
      if (header) header.style.display = q && !visibleRow ? "none" : "";
      sec.style.display = q && !visibleRow ? "none" : "";
    });
    if (searchEmpty) searchEmpty.style.display = q && !anyVisible ? "" : "none";
  };
  if (searchInput) searchInput.addEventListener("input", () => runSearch(searchInput.value));
  if (searchClear) searchClear.addEventListener("click", () => { if (searchInput) { searchInput.value = ""; runSearch(""); searchInput.focus(); } });
```

Note: sub-rows that are hidden by their own logic (e.g. `kyso-ue-show-blue-essence-row` with inline `display:none`) must not be force-shown by clearing search. The filter only sets `display:none` for non-matches and `""` for matches; a row hidden by a `--sub` parent toggle will reappear on clear. This is acceptable (it matches existing behavior where reopening the panel re-evaluates those). If it causes a visible bug in testing, gate `--sub` rows out of `searchRows`.

- [ ] **Step 3: Style the search bar in `utilsCss/ThemeSettings.css`**

```css
/* v3.2 UI Editor search */
.kyso-ue-search {
  position: sticky;
  top: 0;
  z-index: 5;
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 6px 0 10px;
  background: inherit;
}
.kyso-ue-search .kyso-input { flex: 1; }
.kyso-ue-search-clear {
  background: none;
  border: none;
  color: #c8a040;
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
  padding: 0 6px;
}
.kyso-ue-search-empty {
  padding: 14px 0;
  text-align: center;
  opacity: 0.6;
}
```

- [ ] **Step 4: Verify syntax**

Run: `node --check settingsPage.js`
Expected: no output, exit 0.

- [ ] **Step 5: Manual in-client check**

Reload. UI Editor shows a search box on top. Type "blur" → only blur-related rows remain (e.g. "Disable client blur", "Social blur"), other sections collapse. Type gibberish → "Nenhum resultado" shows. Click × → all rows/sections return.

- [ ] **Step 6: Commit**

```bash
git add settingsPage.js utilsCss/ThemeSettings.css
git commit -m "feat(ui-editor): live search bar filters controls by label

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01GS6nD5Q3i4GdahKR43K7hG"
```

---

## Task 8: Crest cleanup — remove default-elo crest thumbnails

**Files:**
- Modify: `assets/manifest.json` — `crests` → `[]`

**Interfaces:**
- Consumes: nothing. The rank `<select>` (`crestRank`/`crestDivision`) already provides the optimized elo path; the crest `buildAssetBlock` keeps web/upload for custom crests.

- [ ] **Step 1: Empty the crests array**

Replace the entire `"crests": [ … 11 entries … ]` value with:

```json
    "crests": [],
```

- [ ] **Step 2: Verify manifest**

Run: `node -e "JSON.parse(require('fs').readFileSync('assets/manifest.json','utf8'));console.log('manifest ok')"`
Expected: `manifest ok`.

- [ ] **Step 3: Manual in-client check**

Reload. Assets → Crests block shows no default elo thumbnails (only the upload "+" tile and the web URL field). The rank `<select>` and division dropdown still work (set a tier → crest changes). Custom upload still applies a crest.

- [ ] **Step 4: Commit**

```bash
git add assets/manifest.json
git commit -m "feat(assets): drop default-elo crest thumbnails (rank select replaces them)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01GS6nD5Q3i4GdahKR43K7hG"
```

---

## Task 9: Final audit — full `applyAllSettings` pass + regression sweep

**Files:**
- Modify (only if gaps found): `settingsPage.js`, `assetReplacers.js`

**Interfaces:**
- Consumes: everything above.
- Produces: confirmation that every new toggle round-trips (persist → apply) and no existing toggle regressed.

- [ ] **Step 1: Confirm `applyAllSettings` calls every apply fn**

Read `applyAllSettings`. Verify it calls, in order: `applyHideOptions`, `applyInterfaceToggles`, `applyVisualToggles`, `assetReplacers.applyScreenBackgrounds`. If any is missing, add it. (No first-run / load path should skip these — `applyAllSettings` is the single entry point invoked on load and on welcome-apply.)

- [ ] **Step 2: Confirm fence uniqueness**

Grep for fence markers: `KYSO-HIDE`, `KYSO-ICON`, `KYSO-INTERFACE`, `KYSO-VIS`. Each must appear exactly once as START and once as END in its own apply function; none may overlap another's regex. Run:
`node --check settingsPage.js && node --check assetReplacers.js`
Expected: no output.

- [ ] **Step 3: Manual regression sweep (user)**

Reload. Walk every UI Editor toggle once (old + new). For each: flip ON then OFF, confirm the targeted element responds and nothing else breaks. Pay special attention to the previously-reported XP-ring regression and the gear/LoR buttons. Confirm KysoTheme and Assets tabs still open and all existing pickers work.

- [ ] **Step 4: Update README (optional, if user wants docs)**

If the user wants the README's UI Editor section updated to list the new toggles, add them under the existing UI Editor docs. Otherwise skip.

- [ ] **Step 5: Final commit (only if Steps 1-2 changed code)**

```bash
git add settingsPage.js assetReplacers.js
git commit -m "chore(ui-editor): wire + audit v3.2 apply pipeline

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01GS6nD5Q3i4GdahKR43K7hG"
```

---

## Self-Review

**Spec coverage:**
- Bucket A (10 toggles) → Task 2. ✓
- Bucket B (4 screens, pickers + toggles + grey-out, OFF=transparent, collections/modeswitcher default OFF) → Tasks 5-6. ✓
- Bucket C (4 effects, default ON) → Task 4. ✓
- Crest cleanup → Task 8. ✓
- Search bar → Task 7. ✓
- Regression audit (gear/LoR duplicate, XP-ring) → Task 3 + Task 9. ✓
- i18n en+pt → Task 1. ✓
- "Don't break existing pickers" → new blocks are additive; Task 6 Step 1 inserts after existing blocks. ✓
- Approach 1 (relocate to JS) → Tasks 2/3/4/5 each delete the theme.css source. ✓

**Placeholder scan:** No TBD/TODO. Every code step has complete code. theme.css deletions specified by exact selector + line range. ✓

**Type/name consistency:** Settings keys identical across Task 1 ↔ binds ↔ apply fns (e.g. `collectionsBgEnabled`, `alwaysShowXpRadial`, `killClientBlur`). Apply fn names consistent: `applyVisualToggles`, `applyScreenBackgrounds`, `applyScreenBgDisabledUI`. Fence `KYSO-VIS` unique. ✓

**Known live-DOM risk:** the XP-ring hover selector (Task 3 Step 2) and the mode-switcher `content:url` behavior (Task 5) depend on live DOM; both have manual verification steps and a documented fallback. If the user grants DevTools for one pass, verify selectors there; otherwise the manual checks catch failures.

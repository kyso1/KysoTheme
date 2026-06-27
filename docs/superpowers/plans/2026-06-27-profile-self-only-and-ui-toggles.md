# Profile self-only fixes + UI Editor toggles (v3.5) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the top-bar icon not updating instantly, scope profile overrides (crest/mastery/transparent-bg) to the local player only, and add two UI-editor switches (League color scheme; swap mastery icon).

**Architecture:** Pengu Loader browser plugin (vanilla ES modules injected into the League CEF client). Icon/colors logic lives in `settingsPage.js`; shadow-DOM asset overrides + self-detection live in `assetReplacers.js`. No build step, no bundler. Settings persist via `loadSettings()`/`saveSettings()`; the UI-editor panel persists each toggle live through `bindToggle` → `persist`.

**Tech Stack:** Plain JavaScript (ES modules), DOM/Shadow-DOM APIs, MutationObserver, LCU REST (`/lol-summoner/v1/current-summoner`).

## Global Constraints

- **No test framework exists.** Verification per task = (a) `node --check <file>` must pass, (b) duplicate-declaration grep before adding any top-level function (a duplicate same-named top-level decl passes `node --check` but breaks the whole plugin load), (c) a precise in-client manual test the user runs. The implementer does NOT drive the live client/DevTools — code only; the user tests.
- **Commits:** author kyso1, Conventional Commits, **no Claude co-author trailer**. Product name stays "KysoTheme" / "Kyso UI Editor".
- **Files:** only `settingsPage.js`, `assetReplacers.js`, `index.js` (version header), `README.MD`. Match surrounding code style (2-space indent, existing comment density, Portuguese/English mix as already present).
- **League gold accent value:** `#C8AA6E` (exact).
- **New toggle defaults:** `iconSwapMastery: false`, `lolColorScheme: false`.
- **Self-detection fails closed:** if the local name is unknown or the profile name node is not found, treat the profile as NOT self (do not paint).
- Run all commands from repo root: `C:/Program Files/Pengu Loader/plugins/KysoTheme`.

---

## File Structure

- `settingsPage.js` — `applyIcon` (signature + CSS), 3 icon handlers, `applyTheme` apply calls, accent routing, `DEFAULTS`, UI-editor `tog()` markup + `bindToggle`, i18n label tables (6 locales), `LOL_GOLD` const.
- `assetReplacers.js` — `ensureSelfSummonerId` (capture name), new `_profileHost()` + `_profileIsSelf()` + `_crestImgAllowed()` helpers, self-guards in `_updateCrestDom` / `_updateProfileIconDom` / `_updateCrestRankDom` / `applyProfileBgTransparent`.
- `index.js` — `@name` version header.
- `README.MD` — feature notes.

Task order: 1 (icon apply pipeline) → 2 (mastery toggle UI) → 3 (League colors) → 4 (self helper) → 5 (crest image + icon self-guard) → 6 (rank/mastery/bg self-guard) → 7 (release docs). Tasks 1-3 are independent of 4-6. Within 4-6, Task 4 must land before 5 and 6.

---

### Task 1: `applyIcon` — instant top-bar sync + mastery-swap gate

Fixes Bug 1 (top-bar icon not instant) and adds the Item-4 CSS gating (default OFF). The mastery selector is decoupled from `syncNavbar` and gated by a new `swapMastery` arg; the three icon handlers + `applyTheme` now pass both flags.

**Files:**
- Modify: `settingsPage.js` — `DEFAULTS` (~1137), `applyIcon` (2048-2077), `applyTheme` (2402), handlers (3867, 3878, 3902), live bind (4086)

**Interfaces:**
- Produces: `applyIcon(url, allPlayers = false, syncNavbar = false, swapMastery = false)`; `DEFAULTS.iconSwapMastery: boolean`.

- [ ] **Step 1: Add `iconSwapMastery` to DEFAULTS**

In `settingsPage.js`, change (line ~1137):

```js
  iconSyncNavbar: true,        // sync chosen profile icon to top navbar
```

to:

```js
  iconSyncNavbar: true,        // sync chosen profile icon to top navbar
  iconSwapMastery: false,      // also replace the champ mastery icon (.style-profile-champion-icon-masked) — opt-in
```

- [ ] **Step 2: Change `applyIcon` signature + decouple the mastery/top selectors**

Replace the `applyIcon` function header and both icon-block branches (lines 2048-2067):

```js
function applyIcon(url, allPlayers = false, syncNavbar = false) {
  const style = getOrCreateDynamicStyle();
  let iconBlock;
  if (!url) {
    iconBlock = `/* KYSO-ICON-START *//* KYSO-ICON-END */\n`;
  } else if (allPlayers) {
    // Modo "todos": seletores globais (comportamento antigo)
    iconBlock = `/* KYSO-ICON-START */\n.icon-image.has-icon,\n.top > .icon-image.has-icon,\n.summoner-level-icon .icon-image {\n  background-image: url("${url}") !important;\n  background-size: cover !important;\n  background-position: center !important;\n}\nsummoner-icon,\nimg.icon-image.has-icon,\n.style-profile-champion-icon-masked > img {\n  content: url("${url}") !important;\n}\n/* KYSO-ICON-END */\n`;
  } else {
    // Modo "só eu": escopo restrito ao avatar próprio na barra lateral.
    // navbarSel was a background-image rule on a SIBLING (.top > .icon-image)
    // which rendered a second icon BELOW the official one. Dropped — we now
    // override the real top-bar <img> (lol-uikit-radial-progress > .top > img)
    // directly via content:url(), so there is exactly one synced icon.
    const navbarSel = "";
    const navbarContentSel = syncNavbar
      ? ",\n.style-profile-champion-icon-masked > img,\nlol-uikit-radial-progress > div.top > img"
      : "";
    iconBlock = `/* KYSO-ICON-START */\nlol-social-avatar .icon-image.has-icon,\nlol-social-avatar .summoner-level-icon .icon-image${navbarSel} {\n  background-image: url("${url}") !important;\n  background-size: cover !important;\n  background-position: center !important;\n}\nlol-social-avatar img.icon-image.has-icon,\nlol-social-avatar summoner-icon${navbarContentSel} {\n  content: url("${url}") !important;\n}\n/* KYSO-ICON-END */\n`;
  }
```

with:

```js
function applyIcon(url, allPlayers = false, syncNavbar = false, swapMastery = false) {
  const style = getOrCreateDynamicStyle();
  // Mastery champ icon (.style-profile-champion-icon-masked) is now opt-in via
  // swapMastery and INDEPENDENT of the top-bar sync. OFF keeps the real mastery icon.
  const masterySel = swapMastery
    ? ",\n.style-profile-champion-icon-masked > img"
    : "";
  let iconBlock;
  if (!url) {
    iconBlock = `/* KYSO-ICON-START *//* KYSO-ICON-END */\n`;
  } else if (allPlayers) {
    // Modo "todos": seletores globais (comportamento antigo)
    iconBlock = `/* KYSO-ICON-START */\n.icon-image.has-icon,\n.top > .icon-image.has-icon,\n.summoner-level-icon .icon-image {\n  background-image: url("${url}") !important;\n  background-size: cover !important;\n  background-position: center !important;\n}\nsummoner-icon,\nimg.icon-image.has-icon${masterySel} {\n  content: url("${url}") !important;\n}\n/* KYSO-ICON-END */\n`;
  } else {
    // Modo "só eu": escopo restrito ao avatar próprio na barra lateral.
    // navbarSel was a background-image rule on a SIBLING (.top > .icon-image)
    // which rendered a second icon BELOW the official one. Dropped — we now
    // override the real top-bar <img> (lol-uikit-radial-progress > .top > img)
    // directly via content:url(), so there is exactly one synced icon.
    const navbarSel = "";
    // Top-bar avatar gated by syncNavbar; mastery gated separately by swapMastery.
    const navbarContentSel =
      masterySel +
      (syncNavbar ? ",\nlol-uikit-radial-progress > div.top > img" : "");
    iconBlock = `/* KYSO-ICON-START */\nlol-social-avatar .icon-image.has-icon,\nlol-social-avatar .summoner-level-icon .icon-image${navbarSel} {\n  background-image: url("${url}") !important;\n  background-size: cover !important;\n  background-position: center !important;\n}\nlol-social-avatar img.icon-image.has-icon,\nlol-social-avatar summoner-icon${navbarContentSel} {\n  content: url("${url}") !important;\n}\n/* KYSO-ICON-END */\n`;
  }
```

(Leave the rest of `applyIcon` — `current`/`withoutIcon`/`style.textContent`/`updateIconInDOM` — unchanged.)

- [ ] **Step 3: Pass both flags from `applyTheme`**

Line 2402, change:

```js
  applyIcon(_iconUrl, _iconAll, merged.iconSyncNavbar);
```

to:

```js
  applyIcon(_iconUrl, _iconAll, merged.iconSyncNavbar, merged.iconSwapMastery);
```

- [ ] **Step 4: Pass both flags from the three icon handlers**

Line 3867 (crop-confirm), change `applyIcon(dataUrl, allPlayers);` to:

```js
      applyIcon(dataUrl, allPlayers, s.iconSyncNavbar, s.iconSwapMastery);
```

Line 3878 (apply button), change `applyIcon(url, allPlayers);` to:

```js
    applyIcon(url, allPlayers, s.iconSyncNavbar, s.iconSwapMastery);
```

Line 3902 (all-players checkbox), change `applyIcon(url, allPlayers);` to:

```js
      applyIcon(url, allPlayers, s.iconSyncNavbar, s.iconSwapMastery);
```

(`s` already carries `iconSyncNavbar`/`iconSwapMastery` because it is built as `{ ...DEFAULTS, ...loadSettings(), ... }`. Leave the reset handler at 3891 `applyIcon("", false)` unchanged — empty URL emits an empty block.)

- [ ] **Step 5: Pass both flags from the live "icon in top bar" toggle**

Line 4086, change:

```js
  bindToggle("#kyso-ue-icon-navbar", "iconSyncNavbar", (s) => applyIcon(s.iconUrl || "", s.iconAllPlayers || false, s.iconSyncNavbar));
```

to:

```js
  bindToggle("#kyso-ue-icon-navbar", "iconSyncNavbar", (s) => applyIcon(s.iconUrl || "", s.iconAllPlayers || false, s.iconSyncNavbar, s.iconSwapMastery));
```

- [ ] **Step 6: Syntax check**

Run: `node --check "settingsPage.js"`
Expected: no output (exit 0).

- [ ] **Step 7: In-client manual test (user)**

1. Restart the League client (Pengu reloads the plugin).
2. With "Profile icon in top bar" ON, pick + apply a new profile icon. **Expected:** the top-bar avatar (`lol-uikit-radial-progress > div.top > img`) updates immediately — no switch toggle needed.
3. Open your profile page: the champion mastery icon (`.style-profile-champion-icon-masked`) shows the REAL mastery icon, not your profile icon (because `iconSwapMastery` defaults OFF).

- [ ] **Step 8: Commit**

```bash
git add settingsPage.js
git commit -m "fix(icon): apply syncNavbar on icon change; gate mastery-icon swap (default off)"
```

---

### Task 2: "Swap mastery icon" toggle in the UI editor

Surfaces Item 4 as a switch. The apply logic already exists (Task 1); this adds the control + label + live bind.

**Files:**
- Modify: `settingsPage.js` — i18n tables (6 locales, after each `iconSyncNavbar:` line), `tog()` markup (~4004), `bindToggle` (~4086)

**Interfaces:**
- Consumes: `applyIcon(url, allPlayers, syncNavbar, swapMastery)` and `DEFAULTS.iconSwapMastery` (Task 1).

- [ ] **Step 1: Add the i18n label to all 6 locales**

Insert an `iconSwapMastery` entry immediately after each locale's `iconSyncNavbar:` line.

en (after line 176 `iconSyncNavbar: "Profile icon in top bar",`):
```js
    iconSwapMastery: "Swap mastery icon with profile icon",
```
pt (after `iconSyncNavbar: "Ícone de perfil na barra superior",`):
```js
    iconSwapMastery: "Trocar ícone de maestria pelo ícone de perfil",
```
es (after `iconSyncNavbar: "Icono de perfil en barra superior",`):
```js
    iconSwapMastery: "Cambiar icono de maestría por el de perfil",
```
de (after `iconSyncNavbar: "Profilsymbol in oberer Leiste",`):
```js
    iconSwapMastery: "Meisterschaftssymbol durch Profilsymbol ersetzen",
```
ja (after `iconSyncNavbar: "トップバーにプロフィールアイコン",`):
```js
    iconSwapMastery: "マスタリーアイコンをプロフィールアイコンに置換",
```
ko (after `iconSyncNavbar: "상단 바에 프로필 아이콘",`):
```js
    iconSwapMastery: "프로필 아이콘으로 숙련도 아이콘 교체",
```

- [ ] **Step 2: Add the toggle to the interface section markup**

Line 4004, change:

```js
      ${tog("kyso-ue-icon-navbar", "iconSyncNavbar")}
```

to:

```js
      ${tog("kyso-ue-icon-navbar", "iconSyncNavbar")}
      ${tog("kyso-ue-icon-swap-mastery", "iconSwapMastery")}
```

- [ ] **Step 3: Bind the toggle (live apply)**

After the icon-navbar bind (line 4086), add:

```js
  bindToggle("#kyso-ue-icon-swap-mastery", "iconSwapMastery", (s) => applyIcon(s.iconUrl || "", s.iconAllPlayers || false, s.iconSyncNavbar, s.iconSwapMastery));
```

- [ ] **Step 4: Syntax check**

Run: `node --check "settingsPage.js"`
Expected: no output (exit 0).

- [ ] **Step 5: In-client manual test (user)**

1. Restart client. Open UI Editor → Interface section → confirm a "Swap mastery icon…" switch appears under "Profile icon in top bar", default OFF.
2. With a custom profile icon applied, toggle the switch ON → the mastery icon (`.style-profile-champion-icon-masked`) becomes your profile icon. Toggle OFF → real mastery icon returns. No restart needed.

- [ ] **Step 6: Commit**

```bash
git add settingsPage.js
git commit -m "feat(ui-editor): add Swap mastery icon toggle"
```

---

### Task 3: "League color scheme" switch

Item 3. A toggle that keeps the themed buttons but forces the accent to League gold (`#C8AA6E`) and disables the RGB animation. Override-only (the accent picker lives in a separate panel and is not greyed; while the switch is ON the saved accent/RGB simply have no visible effect).

**Files:**
- Modify: `settingsPage.js` — `DEFAULTS` (~1123), `LOL_GOLD` const (before `applyAccentColor`, ~1399), accent routing in `applyTheme` (2412-2427), i18n (6 locales), `tog()` markup (~4005), `bindToggle` (~4087)

**Interfaces:**
- Consumes: `applyAccentColor(hex)` (1400), `applyRgbEffect(mode, speed, baseHex)` (1431).
- Produces: `DEFAULTS.lolColorScheme: boolean`; module const `LOL_GOLD`.

- [ ] **Step 1: Add `lolColorScheme` to DEFAULTS**

Line ~1123, change:

```js
  // Color accent
  accentColor: "",
  accentAuto: false,
```

to:

```js
  // Color accent
  accentColor: "",
  accentAuto: false,
  lolColorScheme: false,       // force League's native gold accent (themed buttons kept)
```

- [ ] **Step 2: Add the `LOL_GOLD` module constant**

Immediately before `function applyAccentColor(hex) {` (line ~1399), add:

```js
// League's canonical border gold. Used by the "League color scheme" switch to
// recolor the themed UI to vanilla LoL gold without touching button shapes.
const LOL_GOLD = "#C8AA6E";

```

- [ ] **Step 3: Route the accent through `lolColorScheme` in `applyTheme`**

Replace the accent block (lines 2412-2427):

```js
  // Color accent — still uses resolved bgUrl for auto-extraction
  if (merged.accentAuto) {
    const _gen = ++_accentAutoGen;
    extractAccentFromBackground(bgUrl).then((hex) => {
      if (_gen !== _accentAutoGen) return; // discard stale async result
      applyAccentColor(hex);
      applyRgbEffect(merged.rgbMode || "none", merged.rgbSpeed || 3, hex);
    });
  } else {
    applyAccentColor(merged.accentColor || "");
    applyRgbEffect(
      merged.rgbMode || "none",
      merged.rgbSpeed || 3,
      merged.accentColor || "",
    );
  }
```

with:

```js
  // Color accent — "League color scheme" forces LoL gold + no RGB and wins over
  // both auto-extraction and the custom accent.
  if (merged.lolColorScheme) {
    applyAccentColor(LOL_GOLD);
    applyRgbEffect("none", merged.rgbSpeed || 3, LOL_GOLD);
  } else if (merged.accentAuto) {
    const _gen = ++_accentAutoGen;
    extractAccentFromBackground(bgUrl).then((hex) => {
      if (_gen !== _accentAutoGen) return; // discard stale async result
      applyAccentColor(hex);
      applyRgbEffect(merged.rgbMode || "none", merged.rgbSpeed || 3, hex);
    });
  } else {
    applyAccentColor(merged.accentColor || "");
    applyRgbEffect(
      merged.rgbMode || "none",
      merged.rgbSpeed || 3,
      merged.accentColor || "",
    );
  }
```

- [ ] **Step 4: Add the i18n label to all 6 locales**

Insert a `lolColorScheme` entry immediately after each locale's `iconSwapMastery:` line (added in Task 2).

en:
```js
    lolColorScheme: "League color scheme",
```
pt:
```js
    lolColorScheme: "Esquema de cores do League",
```
es:
```js
    lolColorScheme: "Esquema de colores de League",
```
de:
```js
    lolColorScheme: "League-Farbschema",
```
ja:
```js
    lolColorScheme: "Leagueのカラースキーム",
```
ko:
```js
    lolColorScheme: "리그 색상 구성",
```

- [ ] **Step 5: Add the toggle to the interface section markup**

Line ~4005, change:

```js
      ${tog("kyso-ue-icon-swap-mastery", "iconSwapMastery")}
      ${tog("kyso-ue-play-vanilla", "playVanilla")}
```

to:

```js
      ${tog("kyso-ue-icon-swap-mastery", "iconSwapMastery")}
      ${tog("kyso-ue-lol-colors", "lolColorScheme")}
      ${tog("kyso-ue-play-vanilla", "playVanilla")}
```

- [ ] **Step 6: Bind the toggle (live apply)**

After the swap-mastery bind (Task 2, ~line 4087), add:

```js
  bindToggle("#kyso-ue-lol-colors", "lolColorScheme", (s) => {
    if (s.lolColorScheme) {
      applyAccentColor(LOL_GOLD);
      applyRgbEffect("none", s.rgbSpeed || 3, LOL_GOLD);
    } else {
      applyAccentColor(s.accentColor || "");
      applyRgbEffect(s.rgbMode || "none", s.rgbSpeed || 3, s.accentColor || "");
    }
  });
```

- [ ] **Step 7: Syntax check**

Run: `node --check "settingsPage.js"`
Expected: no output (exit 0).

- [ ] **Step 8: In-client manual test (user)**

1. Restart client. UI Editor → Interface → confirm "League color scheme" switch (default OFF).
2. Toggle ON → buttons/text/borders recolor to League gold; button shapes and the themed play button are unchanged; any RGB animation stops. Toggle OFF → your custom accent / RGB return. No restart needed.
3. Restart with it ON → gold persists.

- [ ] **Step 9: Commit**

```bash
git add settingsPage.js
git commit -m "feat(ui-editor): League color scheme switch (force LoL gold accent)"
```

---

### Task 4: Self-detection helper (`_profileIsSelf`) + local name capture

Item 2 foundation. No behavior change yet — adds the predicate the next tasks consume. Detection compares the open full-profile-page name to the local player's `gameName`; **fails closed**.

**Files:**
- Modify: `assetReplacers.js` — `_selfGameName` var + `ensureSelfSummonerId` (89-105), new `_profileHost()` / `_profileIsSelf()` (after `_crestAllowed`, ~318)

**Interfaces:**
- Consumes: `_selfSummonerId`/`_selfPuuid` machinery, `_hovercardHost` (305), `_crestAllowed` (314).
- Produces: `_profileHost(el) -> Element|null`; `_profileIsSelf() -> boolean`; module var `_selfGameName`.

- [ ] **Step 1: Guard against a duplicate declaration (memory: duplicate top-level decl breaks plugin load)**

Run: `grep -nE "_profileIsSelf|_profileHost|_selfGameName" "assetReplacers.js"`
Expected: no matches (these names are new). If any match exists, STOP and reconcile before adding.

- [ ] **Step 2: Capture the local game name in `ensureSelfSummonerId`**

Change the self-id block (lines 89-97):

```js
let _selfSummonerId = "";
let _selfPuuid = ""; // local player's puuid — matches lobby slots' voice-puuid
let _selfIdPromise = null;
function ensureSelfSummonerId(onResolved) {
  if (_selfSummonerId) { if (onResolved) onResolved(_selfSummonerId); return; }
  if (!_selfIdPromise) {
    _selfIdPromise = fetch("/lol-summoner/v1/current-summoner")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("HTTP " + r.status))))
      .then((d) => { _selfSummonerId = String(d.summonerId || ""); _selfPuuid = String(d.puuid || ""); return _selfSummonerId; })
```

to:

```js
let _selfSummonerId = "";
let _selfPuuid = ""; // local player's puuid — matches lobby slots' voice-puuid
let _selfGameName = ""; // local Riot-ID gameName, normalized (trim+lowercase) — used by _profileIsSelf
let _selfIdPromise = null;
function ensureSelfSummonerId(onResolved) {
  if (_selfSummonerId) { if (onResolved) onResolved(_selfSummonerId); return; }
  if (!_selfIdPromise) {
    _selfIdPromise = fetch("/lol-summoner/v1/current-summoner")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("HTTP " + r.status))))
      .then((d) => { _selfSummonerId = String(d.summonerId || ""); _selfPuuid = String(d.puuid || ""); _selfGameName = String(d.gameName || d.displayName || "").trim().toLowerCase(); return _selfSummonerId; })
```

(Leave the `.catch`, `_selfIdPromise.then`, and closing braces unchanged.)

- [ ] **Step 3: Add `_profileHost` + `_profileIsSelf` after `_crestAllowed`**

After the `_crestAllowed` function (ends line 318, `}`), insert:

```js

// Returns the lol-regalia-profile-v2-element ancestor of `el` (crossing shadow
// boundaries) or null. The profile-page crest lives inside that element's
// (forced-open) shadow root, so a plain .closest() can't reach the host.
function _profileHost(el) {
  let n = el;
  for (let i = 0; i < 12 && n; i++) {
    if (n.tagName === "LOL-REGALIA-PROFILE-V2-ELEMENT") return n;
    const r = n.getRootNode ? n.getRootNode() : null;
    n = r && r.host ? r.host : (n.parentElement || null);
  }
  return null;
}

// True only when the open full profile page belongs to the local player.
// Detection: compare the displayed Riot-ID/name to the local gameName. Other
// players' profile pages use the same element + .style-profile-* classes, so a
// name compare is how we tell them apart. FAILS CLOSED — unknown local name or
// no name node => false, so we never paint a profile we can't confirm is ours.
//
// NAME_SELECTORS is a best-effort candidate list; the correct one is confirmed
// in-client (Step 5). Add/replace the real selector there if none match.
function _profileIsSelf() {
  if (!_selfGameName) return false;
  const profile = document.querySelector("lol-regalia-profile-v2-element");
  if (!profile) return false;
  const NAME_SELECTORS = [
    ".style-profile-header-username",
    ".style-profile-username",
    ".style-profile-display-name",
    "[class*='profile'][class*='username']",
    "[class*='profile'][class*='name']",
  ];
  let nameEl = null;
  for (const sel of NAME_SELECTORS) {
    nameEl =
      profile.querySelector(sel) ||
      (profile.shadowRoot && profile.shadowRoot.querySelector(sel));
    if (nameEl) break;
  }
  if (!nameEl) return false;
  const shown = String(nameEl.textContent || "").trim().toLowerCase().replace(/#.*$/, "").trim();
  const mine = _selfGameName.replace(/#.*$/, "").trim();
  return shown !== "" && shown === mine;
}
```

- [ ] **Step 4: Syntax check**

Run: `node --check "assetReplacers.js"`
Expected: no output (exit 0).

- [ ] **Step 5: In-client name-selector confirmation (user) — CRITICAL**

This task ships no behavior change, but the name selector must be verified before Tasks 5-6 rely on it, otherwise self-profile overrides will silently stop (fail-closed):

1. Open your OWN profile page in the client.
2. In DevTools, inspect the element showing your Riot-ID/name on the profile header. Note its class/selector.
3. Confirm one of the `NAME_SELECTORS` matches it. If NONE match, replace the list's first entry with the real selector (text content must equal your gameName) and re-run `node --check`.
4. Sanity: `document.querySelector("lol-regalia-profile-v2-element")` is non-null while your profile is open.

- [ ] **Step 6: Commit**

```bash
git add assetReplacers.js
git commit -m "feat(self-only): add _profileIsSelf() + capture local gameName"
```

---

### Task 5: Self-guard the crest image + profile-page icon

Item 2 part 1. Gates the custom crest **image** (`applyCrest`) and the profile-page icon paint so they apply only to the local player. Hovercard crests keep the existing `summoner-id` guard; sidebar/lobby crests are untouched.

**Files:**
- Modify: `assetReplacers.js` — new `_crestImgAllowed()` (after `_profileIsSelf`), `_updateCrestDom` (258-266), `_updateProfileIconDom` profile crest branch (113-122)

**Interfaces:**
- Consumes: `_hovercardHost` (305), `_crestAllowed` (314), `_profileHost`/`_profileIsSelf` (Task 4), `CREST_CSS` (246).
- Produces: `_crestImgAllowed(crest) -> boolean` (also consumed by Task 6).

- [ ] **Step 1: Duplicate-declaration guard**

Run: `grep -nE "_crestImgAllowed" "assetReplacers.js"`
Expected: no matches.

- [ ] **Step 2: Add `_crestImgAllowed` after `_profileIsSelf`**

Immediately after the `_profileIsSelf` function added in Task 4, insert:

```js

// Per-crest self-guard for crest-v2 elements anywhere in the document:
//   hovercard  -> allowed only for the local player (summoner-id match)
//   profile pg -> allowed only when the open profile is ours (_profileIsSelf)
//   elsewhere  -> unaffected (sidebar/lobby) — returns true
function _crestImgAllowed(crest) {
  if (_hovercardHost(crest)) return _crestAllowed(crest);
  if (_profileHost(crest)) return _profileIsSelf();
  return true;
}
```

- [ ] **Step 3: Apply the guard in `_updateCrestDom`**

Replace `_updateCrestDom` (lines 258-266):

```js
function _updateCrestDom(url) {
  const crests = _findAllDeep("lol-regalia-crest-v2-element");
  for (const crest of crests) {
    if (!crest.shadowRoot) continue;
    const style = ensureStyleIn(crest.shadowRoot, "kyso-crest-override");
    if (!style) continue;
    style.textContent = CREST_CSS(url);
  }
}
```

with:

```js
function _updateCrestDom(url) {
  const crests = _findAllDeep("lol-regalia-crest-v2-element");
  for (const crest of crests) {
    if (!crest.shadowRoot) continue;
    const style = ensureStyleIn(crest.shadowRoot, "kyso-crest-override");
    if (!style) continue;
    // Self-only: paint our crest image; clear it on others' surfaces (an element
    // may be reused, so explicitly blank disallowed ones).
    style.textContent = _crestImgAllowed(crest) ? CREST_CSS(url) : "";
  }
}
```

- [ ] **Step 4: Gate the profile-page icon paint in `_updateProfileIconDom`**

Replace the profile crest branch (lines 113-122):

```js
  // Profile page crest (shadow root)
  const regaliaProfile = document.querySelector("lol-regalia-profile-v2-element");
  if (regaliaProfile && regaliaProfile.shadowRoot) {
    const icon = regaliaProfile.shadowRoot.querySelector(
      "div > div > div.regalia-profile-crest-hover-area.picker-enabled > lol-regalia-crest-v2-element",
    );
    if (icon && icon.getAttribute("profile-icon-url") !== url) {
      icon.setAttribute("profile-icon-url", url);
    }
  }
```

with:

```js
  // Profile page crest (shadow root) — self-only: never paint another player's profile.
  const regaliaProfile = document.querySelector("lol-regalia-profile-v2-element");
  if (regaliaProfile && regaliaProfile.shadowRoot && _profileIsSelf()) {
    const icon = regaliaProfile.shadowRoot.querySelector(
      "div > div > div.regalia-profile-crest-hover-area.picker-enabled > lol-regalia-crest-v2-element",
    );
    if (icon && icon.getAttribute("profile-icon-url") !== url) {
      icon.setAttribute("profile-icon-url", url);
    }
  }
```

- [ ] **Step 5: Syntax check**

Run: `node --check "assetReplacers.js"`
Expected: no output (exit 0).

- [ ] **Step 6: In-client manual test (user)**

1. Restart client. Set a custom crest image.
2. Your OWN profile page → custom crest shows.
3. Open ANOTHER player's profile page → their real crest shows (NOT yours).
4. Hover your own name (hovercard) → custom crest shows; hover another player → their real crest. Sidebar/lobby unchanged.
   - If your OWN profile no longer shows the custom crest, the name selector from Task 4 Step 5 is wrong — fix `NAME_SELECTORS`.

- [ ] **Step 7: Commit**

```bash
git add assetReplacers.js
git commit -m "fix(crest): self-only guard for crest image + profile-page icon"
```

---

### Task 6: Self-guard rank/mastery-score/tooltip/emblem + transparent background

Item 2 part 2. Gates the remaining profile-page surfaces in `_updateCrestRankDom` and converts `applyProfileBgTransparent` to a self-aware, observed style. Hovercard rank/crest art keep their existing guard.

**Files:**
- Modify: `assetReplacers.js` — `_updateCrestRankDom` (387-479), `applyProfileBgTransparent` (625-645)

**Interfaces:**
- Consumes: `_crestImgAllowed` (Task 5), `_profileIsSelf` (Task 4), `_crestDebounce` (295), `ensureSelfSummonerId` (92).

- [ ] **Step 1: Compute `selfProfile` once and swap the crest-loop guard**

In `_updateCrestRankDom`, after the early return line `if (!tier && !hasLP) return;` (line 393), add a `selfProfile` const. Change:

```js
  const hasLP = lp !== "" && lp != null;
  if (!tier && !hasLP) return;

  const div = _APEX_TIERS.includes(tier) ? "O" : (division || "I");
```

to:

```js
  const hasLP = lp !== "" && lp != null;
  if (!tier && !hasLP) return;

  // Profile-page surfaces (.style-profile-*, tooltip queues, emblem) are painted
  // only on our own profile. Hovercard crests use their own _crestAllowed guard.
  const selfProfile = _profileIsSelf();
  const div = _APEX_TIERS.includes(tier) ? "O" : (division || "I");
```

Then change the crest-loop guard (line 411) from:

```js
      if (!_crestAllowed(el)) return;
```

to:

```js
      if (!_crestImgAllowed(el)) return;
```

- [ ] **Step 2: Gate the emblem subheader text (inside the `if (tier)` block)**

Replace (lines 424-427):

```js
    // Emblem subheader text → the chosen tier label.
    document
      .querySelectorAll(".style-profile-emblem-subheader-ranked > div")
      .forEach((el) => { if (el.textContent !== title) el.textContent = title; });
```

with:

```js
    // Emblem subheader text → the chosen tier label (self profile page only).
    if (selfProfile) {
      document
        .querySelectorAll(".style-profile-emblem-subheader-ranked > div")
        .forEach((el) => { if (el.textContent !== title) el.textContent = title; });
    }
```

- [ ] **Step 3: Gate the mastery-score (LP) text**

Replace (lines 430-435):

```js
  // Profile emblem header mastery-score → show the chosen LP (self profile page).
  if (hasLP) {
    _findAllDeep(".style-profile-champion-mastery-score").forEach((el) => {
      if (el.textContent !== String(lp)) el.textContent = String(lp);
    });
  }
```

with:

```js
  // Profile emblem header mastery-score → show the chosen LP (self profile page only).
  if (hasLP && selfProfile) {
    _findAllDeep(".style-profile-champion-mastery-score").forEach((el) => {
      if (el.textContent !== String(lp)) el.textContent = String(lp);
    });
  }
```

- [ ] **Step 4: Gate the tooltip-queue loop and the standalone emblem block**

Replace the `queues.forEach(...)` loop and the trailing emblem block (lines 452-478):

```js
  queues.forEach((q) => {
    if (!changeAll && qName(q) !== activeQueue) return;
    if (tier) {
      const em = q.querySelector("lol-regalia-emblem-element");
      if (em) {
        setAttrs(em, tierLower); // emblem renders from a LOWERCASE ranked-tier
        if (em.shadowRoot) setAttrs(em.shadowRoot.querySelector("div > div"), tierLower);
      }
      const tEl = q.querySelector(".ranked-tooltip-queue-tier");
      if (tEl && tEl.textContent !== eloLabel) tEl.textContent = eloLabel;
    }
    if (hasLP) {
      const lpEl = q.querySelector(".style-profile-ranked-crest-tooltip-lp");
      const spans = lpEl ? lpEl.querySelectorAll("span") : [];
      if (spans[1] && spans[1].textContent !== String(lp)) spans[1].textContent = String(lp);
    }
  });

  // Emblem elements outside tooltip queues (e.g. the main profile emblem) get
  // only the crest override.
  if (tier) {
    _findAllDeep("lol-regalia-emblem-element").forEach((em) => {
      if (em.closest && em.closest(".ranked-tooltip-queue")) return; // handled above
      setAttrs(em, tierLower);
      if (em.shadowRoot) setAttrs(em.shadowRoot.querySelector("div > div"), tierLower);
    });
  }
}
```

with:

```js
  if (selfProfile) {
    queues.forEach((q) => {
      if (!changeAll && qName(q) !== activeQueue) return;
      if (tier) {
        const em = q.querySelector("lol-regalia-emblem-element");
        if (em) {
          setAttrs(em, tierLower); // emblem renders from a LOWERCASE ranked-tier
          if (em.shadowRoot) setAttrs(em.shadowRoot.querySelector("div > div"), tierLower);
        }
        const tEl = q.querySelector(".ranked-tooltip-queue-tier");
        if (tEl && tEl.textContent !== eloLabel) tEl.textContent = eloLabel;
      }
      if (hasLP) {
        const lpEl = q.querySelector(".style-profile-ranked-crest-tooltip-lp");
        const spans = lpEl ? lpEl.querySelectorAll("span") : [];
        if (spans[1] && spans[1].textContent !== String(lp)) spans[1].textContent = String(lp);
      }
    });

    // Emblem elements outside tooltip queues (e.g. the main profile emblem) get
    // only the crest override.
    if (tier) {
      _findAllDeep("lol-regalia-emblem-element").forEach((em) => {
        if (em.closest && em.closest(".ranked-tooltip-queue")) return; // handled above
        setAttrs(em, tierLower);
        if (em.shadowRoot) setAttrs(em.shadowRoot.querySelector("div > div"), tierLower);
      });
    }
  }
}
```

(The `queues`/`activeQueue` computation above this block stays as-is — it is read-only and harmless when `selfProfile` is false.)

- [ ] **Step 5: Make `applyProfileBgTransparent` self-aware + observed**

Replace the whole function (lines 625-645):

```js
let _profileBgStyle = null;

export function applyProfileBgTransparent(hidden) {
  if (!_profileBgStyle || !_profileBgStyle.isConnected) {
    _profileBgStyle =
      document.getElementById("kyso-profilebg-style") ||
      (() => {
        const s = document.createElement("style");
        s.id = "kyso-profilebg-style";
        document.head.appendChild(s);
        return s;
      })();
  }
  _profileBgStyle.textContent = hidden
    ? `.style-profile-backdrop-component .style-profile-backdrop-container .uikit-background-switcher {
         background: transparent !important;
         background-image: none !important;
         opacity: 0 !important;
       }`
    : "";
}
```

with:

```js
let _profileBgStyle = null;
let _profileBgObserver = null;
let _profileBgHidden = false;

function _updateProfileBgStyle() {
  if (!_profileBgStyle || !_profileBgStyle.isConnected) {
    _profileBgStyle =
      document.getElementById("kyso-profilebg-style") ||
      (() => {
        const s = document.createElement("style");
        s.id = "kyso-profilebg-style";
        document.head.appendChild(s);
        return s;
      })();
  }
  // Self-only: a plain CSS rule can't tell whose profile is open, so toggle the
  // rule on/off as the local player's profile mounts/unmounts.
  _profileBgStyle.textContent = (_profileBgHidden && _profileIsSelf())
    ? `.style-profile-backdrop-component .style-profile-backdrop-container .uikit-background-switcher {
         background: transparent !important;
         background-image: none !important;
         opacity: 0 !important;
       }`
    : "";
}

export function applyProfileBgTransparent(hidden) {
  _profileBgHidden = !!hidden;
  _updateProfileBgStyle();
  // Resolve self-id so the name compare can succeed once known.
  ensureSelfSummonerId(() => _updateProfileBgStyle());
  if (_profileBgObserver) { _profileBgObserver.disconnect(); _profileBgObserver = null; }
  if (!_profileBgHidden) return; // off → nothing to maintain
  _profileBgObserver = new MutationObserver(_crestDebounce(_updateProfileBgStyle, 120));
  _profileBgObserver.observe(document.body, { childList: true, subtree: true });
}
```

- [ ] **Step 6: Syntax check**

Run: `node --check "assetReplacers.js"`
Expected: no output (exit 0).

- [ ] **Step 7: In-client manual test (user)**

1. Restart client. Set a ranked crest tier + LP override, and enable "Transparent profile background".
2. Your OWN profile → crest tier, emblem, mastery-score(LP) and transparent backdrop all apply.
3. Open ANOTHER player's profile → their REAL rank/emblem/mastery and their normal (non-transparent) backdrop; none of your overrides leak.
4. Hover other players → real ranks; hover yourself → your overrides (hovercard path unchanged).
   - If your OWN profile lost its overrides, fix `NAME_SELECTORS` (Task 4 Step 5).

- [ ] **Step 8: Commit**

```bash
git add assetReplacers.js
git commit -m "fix(crest): self-only guard for rank/mastery/transparent-bg on profile page"
```

---

### Task 7: Release docs — v3.5

**Files:**
- Modify: `index.js` (`@name` header, line 2), `README.MD`

- [ ] **Step 1: Bump the plugin version header**

`index.js` line 2, change:

```js
 * @name Kyso UI Editor v3.4
```

to:

```js
 * @name Kyso UI Editor v3.5
```

- [ ] **Step 2: Note the changes in README.MD**

Add a short v3.5 entry to the changelog/features area of `README.MD` (match the existing heading style):

```markdown
### v3.5
- Profile icon now updates the top-bar avatar instantly on apply.
- New switch: **Swap mastery icon** — also replace the champion mastery icon with your profile icon (default off).
- New switch: **League color scheme** — keep the themed buttons but recolor the UI to League's native gold.
- Fix: ranked crest, mastery-score and transparent background now apply only to your own profile, not to other players' profiles.
```

- [ ] **Step 3: Syntax check**

Run: `node --check "index.js"`
Expected: no output (exit 0).

- [ ] **Step 4: Commit**

```bash
git add index.js README.MD
git commit -m "chore(release): v3.5 — instant top-bar icon, self-only profile, new toggles"
```

---

## Self-Review

**Spec coverage:**
- Item 1 (top-bar instant) → Task 1 (Steps 3-5 pass `iconSyncNavbar`). ✓
- Item 2 (self-only): helper → Task 4; crest image + profile icon → Task 5; rank/mastery/tooltip/emblem + transparent-bg → Task 6. ✓
- Item 3 (League colors) → Task 3. ✓ (spec's "grey out accent picker" downgraded to override-only — the picker is in a different panel; documented in Task 3 intro.)
- Item 4 (mastery toggle): apply logic → Task 1; UI → Task 2. ✓
- i18n for both new toggles across 6 locales → Tasks 2 & 3. ✓
- Version/README → Task 7. ✓

**Placeholder scan:** No TBD/TODO; every code step shows full before/after. The only deliberate known-unknown is the profile name selector, handled as a confirmable candidate list with a fail-closed fallback and an explicit verification step (Task 4 Step 5). ✓

**Type/name consistency:** `applyIcon(url, allPlayers, syncNavbar, swapMastery)` used identically in Tasks 1-3. `_profileIsSelf`/`_profileHost` (Task 4) consumed by `_crestImgAllowed` (Task 5) and `_updateCrestRankDom`/`applyProfileBgTransparent` (Task 6). `_crestImgAllowed` defined in Task 5, reused in Task 6. `LOL_GOLD`/`iconSwapMastery`/`lolColorScheme` consistent across tasks. ✓

**Welcome-modal default set (settingsPage.js ~2270-2335):** new toggles default `false` (= theme default), so no entry needed there — intentionally out of scope.

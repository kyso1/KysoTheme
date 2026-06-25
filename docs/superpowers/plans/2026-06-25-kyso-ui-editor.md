# Kyso UI Editor v3.1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn fixed KysoTheme behaviors (play button, banner, gear/LoR buttons, profile background, social blur, profile icon placement) into user-controllable switches/sliders, surfaced both in a new settings section and a first-run welcome modal; rename display to "Kyso UI Editor v3.1".

**Architecture:** Reuse the plugin's existing patterns — single DataStore JSON blob (`KysoTheme.settings`), `DEFAULTS` object, `buildSettingsPanel` template, the `toggles[]`/`filterRanges[]` wiring arrays, `applyAllSettings()` master-apply, the `t()`/`TRANSLATIONS` i18n, and `assetReplacers.js` shadow-DOM deep-injection. New runtime CSS goes into the existing dynamic `<style>` via self-delimited comment blocks (mirroring the `KYSO-ICON-START/END` pattern) so blocks never clobber each other. The play-button theme is *relocated* from static `theme.css` into JS injection so a "vanilla" toggle can cleanly omit it (counter-CSS can't restore the client's frame art).

**Tech Stack:** Vanilla ES modules, Pengu Loader `DataStore`, browser DOM + Shadow DOM, MutationObserver. No build step, no bundler.

## Global Constraints

- Plugin folder name, asset base, and storage key stay EXACTLY as-is: folder `KysoTheme`, `PLUGIN_ASSETS_BASE = //plugins/KysoTheme/assets/`, `STORE_KEY = "KysoTheme.settings"`. No migration.
- Defaults preserve the current look — every new key defaults to current behavior. Exception: `iconSyncNavbar` defaults `true` (only acts when a custom icon is set, so it cannot change an un-customized client).
- i18n: 6 locales `en`, `pt`, `es`, `de`, `ja`, `ko`; `en` is fallback. Every new UI string gets a `t()` key in all 6 locale blocks.
- **No automated test framework exists.** The per-task "test" = `node --check <file>` for JS syntax validity, plus an in-client manual verification note (the executor or user reloads the LoL client and observes). CSS files have no `node --check`; verify by reload.
- All runtime CSS is written through `getOrCreateDynamicStyle()` using self-delimited `/* KYSO-<NAME>-START */ … /* KYSO-<NAME>-END */` blocks; each apply function replaces only its own block via regex.
- Commit after every task. Conventional Commit messages.
- Existing icon mechanism reference: `applyIcon(url, allPlayers)` at `settingsPage.js:1661`; the top-bar summoner icon selector is `.top > .icon-image.has-icon` (already used in all-players mode at line 1668).

## File Structure

| File | Responsibility | Change |
|---|---|---|
| `settingsPage.js` | settings keys, i18n, panel UI, wiring, master-apply, light-DOM CSS injection, welcome modal | Modify |
| `assetReplacers.js` | shadow-DOM injection (banner hide, profile-bg transparent) | Modify |
| `index.js` | blur scrubber → social blur slider bridge; `@name` rename | Modify |
| `main-theme/theme.css` | remove relocated play-button block | Modify |
| `README.MD` | title rename | Modify |

---

### Task 1: New settings keys + i18n strings

**Files:**
- Modify: `settingsPage.js` — `DEFAULTS` (~L786–843) and `TRANSLATIONS` (L12–673)

**Interfaces:**
- Produces: 10 new DEFAULTS keys (`iconSyncNavbar`, `bannerHidden`, `profileBgTransparent`, `gearAlwaysVisible`, `lorAlwaysVisible`, `playVanilla`, `playBgOpacity`, `playBgBlur`, `socialBlur`, `hasSeenWelcome`) and ~25 new `t()` keys used by Tasks 7 & 8.

- [ ] **Step 1: Add keys to DEFAULTS**

In `settingsPage.js`, inside the `DEFAULTS` object (before the closing `};` at ~L843), add:

```js
  // ── Kyso UI Editor (v3.1) ─────────────────────────────────────────────
  iconSyncNavbar: true,        // sync chosen profile icon to top navbar
  bannerHidden: false,         // fully hide profile banner
  profileBgTransparent: false, // transparent profile champ-splash bg
  gearAlwaysVisible: false,    // profile-skin-picker gear: always vs hover
  lorAlwaysVisible: false,     // LoR button: always vs hover
  playVanilla: false,          // revert play button to vanilla
  playBgOpacity: 0,            // themed play button backdrop alpha % (0-100)
  playBgBlur: 0,               // themed play button backdrop blur px (0-20)
  socialBlur: 0,               // social panel backdrop blur px (0-20)
  hasSeenWelcome: false,       // first-run modal gate
```

- [ ] **Step 2: Add i18n keys to all 6 locales**

For EACH locale object in `TRANSLATIONS` (`en` L13, `pt` L123, `es` L233, `de` L344, `ja` L456, `ko` L564), add the following keys using the column for that locale. Add them just before each locale block's closing `},`.

| key | en | pt | es | de | ja | ko |
|---|---|---|---|---|---|---|
| `interfaceSection` | Interface | Interface | Interfaz | Oberfläche | インターフェース | 인터페이스 |
| `iconSyncNavbar` | Profile icon in top bar | Ícone de perfil na barra superior | Icono de perfil en barra superior | Profilsymbol in oberer Leiste | トップバーにプロフィールアイコン | 상단 바에 프로필 아이콘 |
| `bannerHidden` | Hide profile banner | Ocultar banner do perfil | Ocultar banner de perfil | Profilbanner ausblenden | プロフィールバナーを隠す | 프로필 배너 숨기기 |
| `profileBgTransparent` | Transparent profile background | Fundo do perfil transparente | Fondo de perfil transparente | Profilhintergrund transparent | プロフィール背景を透明に | 프로필 배경 투명하게 |
| `gearAlwaysVisible` | Always show settings button | Sempre mostrar botão de config. | Mostrar siempre botón de ajustes | Einstellungsknopf immer zeigen | 設定ボタンを常に表示 | 설정 버튼 항상 표시 |
| `lorAlwaysVisible` | Always show LoR button | Sempre mostrar botão LoR | Mostrar siempre botón LoR | LoR-Knopf immer zeigen | LoRボタンを常に表示 | LoR 버튼 항상 표시 |
| `playVanilla` | Vanilla play button | Botão jogar original | Botón jugar original | Originaler Spielen-Knopf | バニラのプレイボタン | 기본 플레이 버튼 |
| `playBgOpacity` | Play button opacity | Opacidade do botão jogar | Opacidad del botón jugar | Spielen-Knopf Deckkraft | プレイボタンの不透明度 | 플레이 버튼 불투명도 |
| `playBgBlur` | Play button blur | Desfoque do botão jogar | Desenfoque del botón jugar | Spielen-Knopf Unschärfe | プレイボタンのぼかし | 플레이 버튼 흐림 |
| `socialBlur` | Social panel blur | Desfoque do painel social | Desenfoque del panel social | Soziales Panel Unschärfe | ソーシャルパネルのぼかし | 소셜 패널 흐림 |
| `welcomeTitle` | Welcome to Kyso UI Editor | Bem-vindo ao Kyso UI Editor | Bienvenido a Kyso UI Editor | Willkommen bei Kyso UI Editor | Kyso UI Editor へようこそ | Kyso UI Editor에 오신 것을 환영합니다 |
| `welcomeSubtitle` | Quick setup — change anything later in Settings | Config. rápida — altere depois nas Configurações | Configuración rápida — cambia luego en Ajustes | Schnelleinrichtung — später in Einstellungen änderbar | クイック設定 — 後で設定から変更可能 | 빠른 설정 — 나중에 설정에서 변경 가능 |
| `welcomePlay` | Play button | Botão jogar | Botón jugar | Spielen-Knopf | プレイボタン | 플레이 버튼 |
| `welcomeThemed` | Themed | Tema | Con tema | Mit Thema | テーマ | 테마 |
| `welcomeBanner` | Profile banner | Banner do perfil | Banner de perfil | Profilbanner | プロフィールバナー | 프로필 배너 |
| `welcomeButtons` | Settings + LoR buttons | Botões config. + LoR | Botones ajustes + LoR | Knöpfe + LoR | ボタン + LoR | 버튼 + LoR |
| `welcomeAlways` | Always | Sempre | Siempre | Immer | 常に | 항상 |
| `welcomeHover` | On hover | Ao passar o mouse | Al pasar el ratón | Bei Mauszeiger | ホバー時 | 마우스 오버 시 |
| `welcomeProfileBg` | Profile background | Fundo do perfil | Fondo de perfil | Profilhintergrund | プロフィール背景 | 프로필 배경 |
| `welcomeKeep` | Keep | Manter | Mantener | Behalten | 保持 | 유지 |
| `welcomeTransparent` | Transparent | Transparente | Transparente | Transparent | 透明 | 투명 |
| `welcomeOn` | On | Ligado | Activado | An | オン | 켜기 |
| `welcomeOff` | Off | Desligado | Desactivado | Aus | オフ | 끄기 |
| `welcomeApply` | Apply | Aplicar | Aplicar | Anwenden | 適用 | 적용 |
| `welcomeSkip` | Skip | Pular | Omitir | Überspringen | スキップ | 건너뛰기 |

- [ ] **Step 3: Verify JS syntax**

Run: `node --check "C:/Program Files/Pengu Loader/plugins/KysoTheme/settingsPage.js"`
Expected: no output, exit 0.

- [ ] **Step 4: Commit**

```bash
git add settingsPage.js
git commit -m "feat(settings): add UI Editor keys + i18n strings"
```

---

### Task 2: applyInterfaceToggles — gear/LoR overrides + relocated play button

**Files:**
- Modify: `settingsPage.js` — add `applyInterfaceToggles()`, call it from `applyAllSettings` (~L1726, near `applyHideOptions`)
- Modify: `main-theme/theme.css` — delete the relocated play-button rules

**Interfaces:**
- Consumes: `getOrCreateDynamicStyle()` (existing), `DEFAULTS` keys from Task 1.
- Produces: `applyInterfaceToggles(settings)` — injects the `KYSO-INTERFACE` block.

- [ ] **Step 1: Remove play-button rules from theme.css**

In `main-theme/theme.css`, DELETE these rules (they move to JS):
- L258–260 (`.play-button-frame { background-image: none !important; }`)
- L371–373 (`.play-button-content { left: 30px !important; }`)
- L374–439 (the entire `.play-button-container` / `:hover` / `.play-button-content` width / `.play-button-text` / all `:after` visibility-guard rules through `.play-button-container:active .play-button-text:after`)

Leave the comment header at L367–370 in place (or delete it too). Leave everything outside this range untouched (e.g. L255–256 `.league-logo`, L261–263 video-state-machine, L440+ loading screen).

- [ ] **Step 2: Add `applyInterfaceToggles` to settingsPage.js**

Add this function near the other apply functions (e.g. just before `applyAllSettings` at ~L1721):

```js
// Builds the themed play-button CSS (relocated from theme.css). When the user
// chooses vanilla, this is omitted entirely so the client's own art returns.
function _playButtonThemedCss(opacity, blur) {
  const alpha = Math.max(0, Math.min(100, Number(opacity) || 0)) / 100;
  const b = Math.max(0, Math.min(20, Number(blur) || 0));
  const bgRule = alpha > 0 ? `background: rgba(0,0,0,${alpha}) !important;` : `background: transparent !important;`;
  const blurRule = b > 0 ? `backdrop-filter: blur(${b}px) !important; -webkit-backdrop-filter: blur(${b}px) !important;` : "";
  return `
.play-button-frame { background-image: none !important; }
.play-button-content { left: 30px !important; width: calc(100% - 52px) !important; }
.play-button-container {
  ${bgRule}
  ${blurRule}
  border-radius: 50px !important;
  border: 1px solid var(--kyso-accent) !important;
  filter: drop-shadow(1px 1px 8px var(--kyso-accent-glow)) !important;
  transition: 0.2s !important;
  cursor: pointer;
}
.play-button-container:hover { filter: drop-shadow(1px 1px 15px var(--kyso-accent-glow)) !important; transition: 0.2s !important; }
.play-button-text { color: var(--kyso-accent) !important; font-family: "Open Sans", sans-serif !important; content: "▶" !important; visibility: hidden; z-index: 0 !important; }
.play-button-text:after { content: "▶"; visibility: visible; display: block; position: absolute; left: 28px; }
#rcp-fe-viewport-root > .rcp-fe-viewport-overlay > .screen-root[style*="visibility: hidden;"] ~ .play-button-text:after { visibility: hidden !important; }
.play-button-component[style*="visibility: hidden;"] ~ .play-button-text:after { visibility: hidden !important; }
.play-button-component[style*="visibility: hidden;"] + .play-button-text:after { visibility: hidden !important; }
.play-button-component[style*="visibility: hidden;"] .play-button-text:after { visibility: hidden !important; }
.screen-root[style*="visibility: hidden;"] .play-button-text:after { visibility: hidden !important; }
.screen-root[style*="visibility: hidden;"] ~ .play-button-text:after { visibility: hidden !important; }
.screen-root[style*="visibility: hidden;"] + .play-button-text:after { visibility: hidden !important; }
.champion-select-main-container:not(:hidden) ~ .play-button-text:after { display: none !important; visibility: hidden !important; }
.champion-select-main-container:visible .play-button-text:after { display: none !important; }
.play-button-container:hover .play-button-text:after { color: #c7c7c7 !important; }
.play-button-container:active .play-button-text:after { color: #c7c7c7 !important; }
`;
}

// Injects the KYSO-INTERFACE delimited block: play button (themed unless
// vanilla), gear/LoR always-visible overrides.
function applyInterfaceToggles(settings) {
  const style = getOrCreateDynamicStyle();
  let block = "/* KYSO-INTERFACE-START */\n";
  if (!settings.playVanilla) {
    block += _playButtonThemedCss(settings.playBgOpacity, settings.playBgBlur);
  }
  if (settings.gearAlwaysVisible) {
    block += `.style-profile-skin-picker-button { opacity: 1 !important; }\n`;
  }
  if (settings.lorAlwaysVisible) {
    block += `.launch-lor-button-container, .deep-links-promo { opacity: 1 !important; }\n`;
  }
  block += "/* KYSO-INTERFACE-END */\n";

  const current = style.textContent || "";
  const without = current.replace(
    /\/\* KYSO-INTERFACE-START \*\/[\s\S]*?\/\* KYSO-INTERFACE-END \*\//g,
    "",
  );
  style.textContent = without + block;
}
```

- [ ] **Step 3: Call it from applyAllSettings**

In `applyAllSettings` (~L1721), after the existing `applyHideOptions(merged);` line (~L1726), add:

```js
  applyInterfaceToggles(merged);
```

- [ ] **Step 4: Verify JS syntax**

Run: `node --check "C:/Program Files/Pengu Loader/plugins/KysoTheme/settingsPage.js"`
Expected: no output, exit 0.

- [ ] **Step 5: Manual verify (in client)**

Reload the LoL client. With default settings the play button must look IDENTICAL to before (themed pill + ▶). Then in DevTools console run `DataStore.set("KysoTheme.settings", JSON.stringify({...JSON.parse(DataStore.get("KysoTheme.settings")||"{}"), playVanilla:true})); location.reload();` — the play button must revert to the vanilla frame. Reset `playVanilla:false` afterward. (If no DevTools, defer to the user; record that it was deferred.)

- [ ] **Step 6: Commit**

```bash
git add settingsPage.js main-theme/theme.css
git commit -m "feat(play): relocate play-button theme to JS, gate behind vanilla toggle + gear/LoR overrides"
```

---

### Task 3: Transparent profile background (shadow-DOM deep inject)

**Files:**
- Modify: `assetReplacers.js` — add `applyProfileBgTransparent()` using existing `_findAllDeep`/`ensureStyleIn`
- Modify: `settingsPage.js` — call it from `applyAllSettings`

**Interfaces:**
- Consumes: `_findAllDeep(tagName)`, `ensureStyleIn(root, id)` (existing in assetReplacers.js).
- Produces: `applyProfileBgTransparent(hidden)` exported.

- [ ] **Step 1: Investigate the splash selector (one-time)**

Open the LoL client profile page, DevTools → inspect `lol-regalia-profile-v2-element`. The champion-splash background is inside its shadow root. Note the element/class that paints the splash (candidates seen in this client family: a child with class containing `background` or `summoner-banner`, or the `lol-regalia-profile-v2-element` host itself). The injection below targets broad candidates so it works without an exact name. If you find the exact class, narrow the selector.

- [ ] **Step 2: Add `applyProfileBgTransparent` to assetReplacers.js**

Append to `assetReplacers.js`:

```js
// applyProfileBgTransparent — hides the profile-page champion-splash background
// so a custom #kyso-global-bg shows through. Deep-injects into every
// lol-regalia-profile-v2-element shadow root.
let _profileBgObserver = null;
let _profileBgHidden = false;

const PROFILE_BG_CSS = (hidden) => hidden
  ? `:host, [class*="background"], [class*="splash"], [class*="banner-image"] {
       background: transparent !important;
       background-image: none !important;
     }
     img[class*="background"], img[class*="splash"] { opacity: 0 !important; }`
  : "";

function _updateProfileBgDom(hidden) {
  const profiles = _findAllDeep("lol-regalia-profile-v2-element");
  for (const p of profiles) {
    if (!p.shadowRoot) continue;
    const style = ensureStyleIn(p.shadowRoot, "kyso-profilebg-override");
    if (!style) continue;
    style.textContent = PROFILE_BG_CSS(hidden);
  }
}

export function applyProfileBgTransparent(hidden) {
  _profileBgHidden = !!hidden;
  if (_profileBgObserver) _profileBgObserver.disconnect();
  _updateProfileBgDom(_profileBgHidden);
  _profileBgObserver = new MutationObserver(() => {
    _updateProfileBgDom(_profileBgHidden);
  });
  _profileBgObserver.observe(document.body, { childList: true, subtree: true });
}
```

- [ ] **Step 3: Wire into applyAllSettings**

In `settingsPage.js` `applyAllSettings`, after the `assetReplacers.applyCrest(...)` line (~L1729), add:

```js
  assetReplacers.applyProfileBgTransparent(merged.profileBgTransparent);
```

- [ ] **Step 4: Verify JS syntax**

Run: `node --check "C:/Program Files/Pengu Loader/plugins/KysoTheme/assetReplacers.js"` and `node --check "C:/Program Files/Pengu Loader/plugins/KysoTheme/settingsPage.js"`
Expected: no output, exit 0 for both.

- [ ] **Step 5: Manual verify (in client)**

Set `profileBgTransparent:true` via the DataStore console one-liner (as in Task 2 Step 5), reload, open your profile — the champion splash should be transparent and the custom background visible behind it. Reset to `false`. If the splash is unaffected, narrow the selector from Step 1 and re-test. Record result.

- [ ] **Step 6: Commit**

```bash
git add assetReplacers.js settingsPage.js
git commit -m "feat(profile): transparent profile background toggle (shadow-DOM inject)"
```

---

### Task 4: Hide profile banner (shadow-DOM deep inject)

**Files:**
- Modify: `assetReplacers.js` — add `applyBannerVisibility()`
- Modify: `settingsPage.js` — call it from `applyAllSettings`

**Interfaces:**
- Consumes: `_findAllDeep`, `ensureStyleIn`.
- Produces: `applyBannerVisibility(hidden)` exported. Independent of `applyBanner(url)`; uses a separate style id so both can coexist (hide wins).

- [ ] **Step 1: Add `applyBannerVisibility` to assetReplacers.js**

Append to `assetReplacers.js`:

```js
// applyBannerVisibility — fully hides the profile banner across all surfaces
// (profile page, hover cards). Separate style id from applyBanner so the
// image-override and the hide can coexist; hide wins.
let _bannerHideObserver = null;
let _bannerHidden = false;

function _updateBannerHideDom(hidden) {
  const banners = _findAllDeep("lol-regalia-banner-v2-element");
  for (const banner of banners) {
    if (!banner.shadowRoot) continue;
    const style = ensureStyleIn(banner.shadowRoot, "kyso-banner-hide");
    if (!style) continue;
    style.textContent = hidden ? `:host { display: none !important; }` : "";
  }
}

export function applyBannerVisibility(hidden) {
  _bannerHidden = !!hidden;
  if (_bannerHideObserver) _bannerHideObserver.disconnect();
  _updateBannerHideDom(_bannerHidden);
  _bannerHideObserver = new MutationObserver(() => {
    _updateBannerHideDom(_bannerHidden);
  });
  _bannerHideObserver.observe(document.body, { childList: true, subtree: true });
}
```

- [ ] **Step 2: Wire into applyAllSettings**

In `settingsPage.js` `applyAllSettings`, after the `assetReplacers.applyBanner(...)` line (~L1728), add:

```js
  assetReplacers.applyBannerVisibility(merged.bannerHidden);
```

- [ ] **Step 3: Verify JS syntax**

Run: `node --check "C:/Program Files/Pengu Loader/plugins/KysoTheme/assetReplacers.js"`
Expected: no output, exit 0.

- [ ] **Step 4: Manual verify (in client)**

Set `bannerHidden:true` via console one-liner, reload, open profile — banner gone. Also check a friend hover card — banner gone there too. Reset to `false`. Record result.

- [ ] **Step 5: Commit**

```bash
git add assetReplacers.js settingsPage.js
git commit -m "feat(banner): toggle to fully hide profile banner"
```

---

### Task 5: Profile icon → top navbar sync

**Files:**
- Modify: `settingsPage.js` — `applyIcon` (L1661) signature + self-only block; `applyAllSettings` icon call (~L1730–1733)

**Interfaces:**
- Consumes: existing `applyIcon(url, allPlayers)`.
- Produces: `applyIcon(url, allPlayers, syncNavbar)` — third param defaults `false`; when self-only and `syncNavbar`, the injected self-only block also targets `.top > .icon-image.has-icon`.

- [ ] **Step 1: Extend `applyIcon` signature + self-only block**

In `settingsPage.js`, change the function signature at L1661:

```js
function applyIcon(url, allPlayers = false, syncNavbar = false) {
```

Then in the self-only branch (the `} else {` at L1669–1671), replace the `iconBlock` assignment with a version that conditionally appends navbar selectors:

```js
  } else {
    // Modo "só eu": escopo restrito ao avatar próprio na barra lateral
    const navbarSel = syncNavbar
      ? ",\n.top > .icon-image.has-icon,\n.main-navigation .icon-image.has-icon"
      : "";
    const navbarContentSel = syncNavbar
      ? ",\n.style-profile-champion-icon-masked > img"
      : "";
    iconBlock = `/* KYSO-ICON-START */\nlol-social-avatar .icon-image.has-icon,\nlol-social-avatar .summoner-level-icon .icon-image${navbarSel} {\n  background-image: url("${url}") !important;\n  background-size: cover !important;\n  background-position: center !important;\n}\nlol-social-avatar img.icon-image.has-icon,\nlol-social-avatar summoner-icon${navbarContentSel} {\n  content: url("${url}") !important;\n}\n/* KYSO-ICON-END */\n`;
  }
```

(Leave the `!url` and `allPlayers` branches unchanged. `allPlayers` mode already covers the navbar.)

- [ ] **Step 2: Pass `iconSyncNavbar` from applyAllSettings**

In `applyAllSettings` (~L1730–1733), update the icon call. Replace:

```js
  applyIcon(_iconUrl, _iconAll);
```

with:

```js
  applyIcon(_iconUrl, _iconAll, merged.iconSyncNavbar);
```

- [ ] **Step 3: Verify JS syntax**

Run: `node --check "C:/Program Files/Pengu Loader/plugins/KysoTheme/settingsPage.js"`
Expected: no output, exit 0.

- [ ] **Step 4: Manual verify (in client)**

With a custom profile icon set (Player Assets tab) and `iconSyncNavbar:true` (default), reload — the chosen icon must appear on the profile crest, the social sidebar avatar, AND the top navbar summoner icon. Set `iconSyncNavbar:false`, reload — navbar reverts to the real icon while sidebar/profile still show the custom one. Record result. (If the navbar selector doesn't hit, inspect the top-bar icon element live and adjust `navbarSel`.)

- [ ] **Step 5: Commit**

```bash
git add settingsPage.js
git commit -m "feat(icon): sync custom profile icon to top navbar (toggle)"
```

---

### Task 6: Social panel blur slider

**Files:**
- Modify: `index.js` — `initBlurScrubber` (L96–129) reads social blur from a shared global; add a reader of `KysoTheme.settings` at init
- Modify: `settingsPage.js` — add `applySocialBlur(px)` bridge; call from `applyAllSettings`

**Interfaces:**
- Produces: `window.__kysoSocialBlur` (number px, default from DataStore) read by the scrubber; `applySocialBlur(px)` in settingsPage updates it and triggers a re-scrub via `window.__kysoRescrub`.

- [ ] **Step 1: Rework `initBlurScrubber` in index.js**

Replace the `initBlurScrubber` function (L96–129) with a version that splits hard-kill targets from social targets, and applies blur on social targets when `window.__kysoSocialBlur > 0`:

```js
function initBlurScrubber() {
  // Always hard-kill blur on these (chrome/navbar/frame):
  const KILL_TARGETS = [
    "lol-uikit-navigation-bar",
    ".rcp-fe-lol-uikit-frame",
  ];
  // Social surfaces: blur driven by the user's socialBlur slider.
  const SOCIAL_TARGETS = [
    ".lol-social-sidebar",
    ".lol-social-lower-pane-container",
    ".lol-social-roster",
    ".parties-view",
    ".parties-view .parties-content",
    ".parties-content",
  ];

  // Seed from saved settings so blur is correct before the settings UI loads.
  try {
    const raw = DataStore.get("KysoTheme.settings");
    const s = raw ? JSON.parse(raw) : {};
    window.__kysoSocialBlur = Number(s.socialBlur) || 0;
  } catch {
    window.__kysoSocialBlur = 0;
  }

  const scrub = () => {
    for (const sel of KILL_TARGETS) {
      document.querySelectorAll(sel).forEach((el) => {
        el.style.setProperty("backdrop-filter", "none", "important");
        el.style.setProperty("-webkit-backdrop-filter", "none", "important");
        const cur = getComputedStyle(el).filter;
        if (cur && cur.includes("blur")) el.style.setProperty("filter", "none", "important");
      });
    }
    const px = Number(window.__kysoSocialBlur) || 0;
    for (const sel of SOCIAL_TARGETS) {
      document.querySelectorAll(sel).forEach((el) => {
        if (px > 0) {
          el.style.setProperty("backdrop-filter", `blur(${px}px)`, "important");
          el.style.setProperty("-webkit-backdrop-filter", `blur(${px}px)`, "important");
        } else {
          el.style.setProperty("backdrop-filter", "none", "important");
          el.style.setProperty("-webkit-backdrop-filter", "none", "important");
        }
      });
    }
  };

  window.__kysoRescrub = scrub;
  scrub();
  new MutationObserver(scrub).observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["style", "class"],
  });
}
```

- [ ] **Step 2: Add `applySocialBlur` bridge to settingsPage.js**

Add near the other apply functions:

```js
// Bridges the social-blur slider to index.js's blur scrubber.
function applySocialBlur(px) {
  window.__kysoSocialBlur = Math.max(0, Math.min(20, Number(px) || 0));
  if (typeof window.__kysoRescrub === "function") window.__kysoRescrub();
}
```

- [ ] **Step 3: Wire into applyAllSettings**

In `applyAllSettings`, after `applyInterfaceToggles(merged);` (from Task 2), add:

```js
  applySocialBlur(merged.socialBlur);
```

- [ ] **Step 4: Verify JS syntax**

Run: `node --check "C:/Program Files/Pengu Loader/plugins/KysoTheme/index.js"` and `node --check "C:/Program Files/Pengu Loader/plugins/KysoTheme/settingsPage.js"`
Expected: no output, exit 0 for both.

- [ ] **Step 5: Manual verify (in client)**

Default (`socialBlur:0`) — social panel identical to before (no blur). Set `socialBlur:12` via console one-liner, run `window.__kysoRescrub()` — social panel blurs immediately; navbar stays unblurred. Reload to confirm it seeds from DataStore. Reset to `0`. Record result.

- [ ] **Step 6: Commit**

```bash
git add index.js settingsPage.js
git commit -m "feat(social): social-panel blur slider via scrubber bridge"
```

---

### Task 7: Interface settings section UI + wiring

**Files:**
- Modify: `settingsPage.js` — `buildSettingsPanel` template (add `<section>` after RGB section ~L2280), `toggles[]` array (~L2328), slider wiring (~L2543 region), save-all object (~L2610)

**Interfaces:**
- Consumes: `applyInterfaceToggles`, `applyProfileBgTransparent`, `applyBannerVisibility`, `applyIcon`, `applySocialBlur`, all `t()` keys from Task 1.
- Produces: live-editable controls for all 9 user-facing keys (`hasSeenWelcome` excluded — internal).

- [ ] **Step 1: Add the Interface `<section>` to the panel template**

In `buildSettingsPanel`, immediately after the RGB section closes (after its `</section>`, ~L2280) and before the Font section, insert:

```html
      <section class="kyso-settings-section" id="kyso-interface-section">
        <h3 class="kyso-section-title">${t("interfaceSection")}</h3>

        <div class="kyso-settings-row kyso-settings-row--toggle">
          <label class="kyso-label">${t("iconSyncNavbar")}</label>
          <label class="kyso-toggle"><input id="kyso-icon-navbar" type="checkbox" ${settings.iconSyncNavbar ? "checked" : ""}><span class="kyso-toggle-slider"></span></label>
        </div>
        <div class="kyso-settings-row kyso-settings-row--toggle">
          <label class="kyso-label">${t("bannerHidden")}</label>
          <label class="kyso-toggle"><input id="kyso-banner-hidden" type="checkbox" ${settings.bannerHidden ? "checked" : ""}><span class="kyso-toggle-slider"></span></label>
        </div>
        <div class="kyso-settings-row kyso-settings-row--toggle">
          <label class="kyso-label">${t("profileBgTransparent")}</label>
          <label class="kyso-toggle"><input id="kyso-profilebg" type="checkbox" ${settings.profileBgTransparent ? "checked" : ""}><span class="kyso-toggle-slider"></span></label>
        </div>
        <div class="kyso-settings-row kyso-settings-row--toggle">
          <label class="kyso-label">${t("gearAlwaysVisible")}</label>
          <label class="kyso-toggle"><input id="kyso-gear-always" type="checkbox" ${settings.gearAlwaysVisible ? "checked" : ""}><span class="kyso-toggle-slider"></span></label>
        </div>
        <div class="kyso-settings-row kyso-settings-row--toggle">
          <label class="kyso-label">${t("lorAlwaysVisible")}</label>
          <label class="kyso-toggle"><input id="kyso-lor-always" type="checkbox" ${settings.lorAlwaysVisible ? "checked" : ""}><span class="kyso-toggle-slider"></span></label>
        </div>
        <div class="kyso-settings-row kyso-settings-row--toggle">
          <label class="kyso-label">${t("playVanilla")}</label>
          <label class="kyso-toggle"><input id="kyso-play-vanilla" type="checkbox" ${settings.playVanilla ? "checked" : ""}><span class="kyso-toggle-slider"></span></label>
        </div>
        <div class="kyso-settings-row kyso-filter-row">
          <label class="kyso-label" for="kyso-play-opacity">${t("playBgOpacity")}</label>
          <input type="range" id="kyso-play-opacity" class="kyso-range" min="0" max="100" step="1" value="${settings.playBgOpacity || 0}">
          <span class="kyso-filter-value" id="kyso-play-opacity-value">${settings.playBgOpacity || 0}%</span>
        </div>
        <div class="kyso-settings-row kyso-filter-row">
          <label class="kyso-label" for="kyso-play-blur">${t("playBgBlur")}</label>
          <input type="range" id="kyso-play-blur" class="kyso-range" min="0" max="20" step="1" value="${settings.playBgBlur || 0}">
          <span class="kyso-filter-value" id="kyso-play-blur-value">${settings.playBgBlur || 0}px</span>
        </div>
        <div class="kyso-settings-row kyso-filter-row">
          <label class="kyso-label" for="kyso-social-blur">${t("socialBlur")}</label>
          <input type="range" id="kyso-social-blur" class="kyso-range" min="0" max="20" step="1" value="${settings.socialBlur || 0}">
          <span class="kyso-filter-value" id="kyso-social-blur-value">${settings.socialBlur || 0}px</span>
        </div>
      </section>
```

- [ ] **Step 2: Register the toggles in the `toggles[]` array**

In the `toggles` array (~L2328) add:

```js
    { id: "kyso-icon-navbar", key: "iconSyncNavbar" },
    { id: "kyso-banner-hidden", key: "bannerHidden" },
    { id: "kyso-profilebg", key: "profileBgTransparent" },
    { id: "kyso-gear-always", key: "gearAlwaysVisible" },
    { id: "kyso-lor-always", key: "lorAlwaysVisible" },
    { id: "kyso-play-vanilla", key: "playVanilla" },
```

Then, in the toggles `.forEach` apply branch (the `if/else` chain ending in `applyHideOptions(s)` at ~L2377–2385), add a branch so these new keys re-apply correctly. Replace the final `else { applyHideOptions(s); }` with:

```js
      } else if (key === "iconSyncNavbar") {
        const u = s.iconUrl || "";
        applyIcon(u, s.iconAllPlayers || false, s.iconSyncNavbar);
      } else if (key === "bannerHidden") {
        assetReplacers.applyBannerVisibility(s.bannerHidden);
      } else if (key === "profileBgTransparent") {
        assetReplacers.applyProfileBgTransparent(s.profileBgTransparent);
      } else if (key === "gearAlwaysVisible" || key === "lorAlwaysVisible" || key === "playVanilla") {
        applyInterfaceToggles(s);
      } else {
        applyHideOptions(s);
      }
```

- [ ] **Step 3: Wire the three sliders**

In the slider-wiring region (after the `filterRanges.forEach` at ~L2561), add a standalone block:

```js
  // ── Interface sliders (play opacity/blur, social blur) ─────────────────
  const interfaceRanges = [
    { id: "kyso-play-opacity", key: "playBgOpacity", valueId: "kyso-play-opacity-value", unit: "%", apply: (s) => applyInterfaceToggles(s) },
    { id: "kyso-play-blur",    key: "playBgBlur",    valueId: "kyso-play-blur-value",    unit: "px", apply: (s) => applyInterfaceToggles(s) },
    { id: "kyso-social-blur",  key: "socialBlur",    valueId: "kyso-social-blur-value",  unit: "px", apply: (s) => applySocialBlur(s.socialBlur) },
  ];
  interfaceRanges.forEach(({ id, key, valueId, unit, apply }) => {
    const input = panel.querySelector(`#${id}`);
    const display = panel.querySelector(`#${valueId}`);
    if (!input) return;
    input.addEventListener("input", () => {
      const v = Number(input.value) || 0;
      if (display) display.textContent = `${v}${unit}`;
      const s = { ...DEFAULTS, ...loadSettings(), [key]: v };
      saveSettings(s);
      apply(s);
    });
  });
```

- [ ] **Step 4: Add fields to the save-all object**

In the save-all handler object (~L2610–2635), add:

```js
      iconSyncNavbar: panel.querySelector("#kyso-icon-navbar").checked,
      bannerHidden: panel.querySelector("#kyso-banner-hidden").checked,
      profileBgTransparent: panel.querySelector("#kyso-profilebg").checked,
      gearAlwaysVisible: panel.querySelector("#kyso-gear-always").checked,
      lorAlwaysVisible: panel.querySelector("#kyso-lor-always").checked,
      playVanilla: panel.querySelector("#kyso-play-vanilla").checked,
      playBgOpacity: Number(panel.querySelector("#kyso-play-opacity").value) || 0,
      playBgBlur: Number(panel.querySelector("#kyso-play-blur").value) || 0,
      socialBlur: Number(panel.querySelector("#kyso-social-blur").value) || 0,
```

- [ ] **Step 5: Verify JS syntax**

Run: `node --check "C:/Program Files/Pengu Loader/plugins/KysoTheme/settingsPage.js"`
Expected: no output, exit 0.

- [ ] **Step 6: Manual verify (in client)**

Open Settings → KysoTheme tab → new "Interface" section is present with 6 toggles + 3 sliders. Flip each toggle and drag each slider; each must take effect live (no reload) and persist after reload. Confirm "Save all" still works. Record result.

- [ ] **Step 7: Commit**

```bash
git add settingsPage.js
git commit -m "feat(settings): Interface section UI + wiring for all UI Editor controls"
```

---

### Task 8: First-run welcome modal

**Files:**
- Modify: `settingsPage.js` — add `showWelcomeModal()`; call from `initSettingsPage` (L3174–3225)
- Modify: `utilsCss/ThemeSettings.css` — modal styles

**Interfaces:**
- Consumes: `loadSettings`, `saveSettings`, `applyAllSettings`, `DEFAULTS`, `t()` keys, `applySocialBlur`.
- Produces: `showWelcomeModal()`; sets `hasSeenWelcome:true` on Apply or Skip.

- [ ] **Step 1: Add `showWelcomeModal` to settingsPage.js**

```js
function showWelcomeModal() {
  if (document.querySelector("#kyso-welcome-overlay")) return;
  const s = { ...DEFAULTS, ...loadSettings() };
  const overlay = document.createElement("div");
  overlay.id = "kyso-welcome-overlay";
  overlay.innerHTML = `
    <div class="kyso-welcome-card">
      <h2 class="kyso-welcome-title">${t("welcomeTitle")}</h2>
      <p class="kyso-welcome-sub">${t("welcomeSubtitle")}</p>
      <div class="kyso-welcome-row">
        <span>${t("welcomePlay")}</span>
        <label class="kyso-toggle"><input id="kyso-w-play" type="checkbox"><span class="kyso-toggle-slider"></span></label>
        <small>${t("playVanilla")}</small>
      </div>
      <div class="kyso-welcome-row">
        <span>${t("welcomeBanner")}</span>
        <label class="kyso-toggle"><input id="kyso-w-banner" type="checkbox"><span class="kyso-toggle-slider"></span></label>
        <small>${t("bannerHidden")}</small>
      </div>
      <div class="kyso-welcome-row">
        <span>${t("welcomeButtons")}</span>
        <label class="kyso-toggle"><input id="kyso-w-buttons" type="checkbox"><span class="kyso-toggle-slider"></span></label>
        <small>${t("welcomeAlways")}</small>
      </div>
      <div class="kyso-welcome-row">
        <span>${t("welcomeProfileBg")}</span>
        <label class="kyso-toggle"><input id="kyso-w-profilebg" type="checkbox"><span class="kyso-toggle-slider"></span></label>
        <small>${t("welcomeTransparent")}</small>
      </div>
      <div class="kyso-welcome-row">
        <span>${t("socialBlur")}</span>
        <input type="range" id="kyso-w-social" class="kyso-range" min="0" max="20" step="1" value="0">
        <small id="kyso-w-social-val">0px</small>
      </div>
      <div class="kyso-welcome-actions">
        <button id="kyso-w-skip" class="kyso-btn">${t("welcomeSkip")}</button>
        <button id="kyso-w-apply" class="kyso-btn kyso-btn--primary">${t("welcomeApply")}</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);

  const sv = overlay.querySelector("#kyso-w-social");
  const svVal = overlay.querySelector("#kyso-w-social-val");
  sv.addEventListener("input", () => { svVal.textContent = `${sv.value}px`; });

  const close = () => overlay.remove();

  overlay.querySelector("#kyso-w-skip").addEventListener("click", () => {
    const next = { ...DEFAULTS, ...loadSettings(), hasSeenWelcome: true };
    saveSettings(next);
    close();
  });

  overlay.querySelector("#kyso-w-apply").addEventListener("click", () => {
    const buttonsAlways = overlay.querySelector("#kyso-w-buttons").checked;
    const next = {
      ...DEFAULTS, ...loadSettings(),
      playVanilla: overlay.querySelector("#kyso-w-play").checked,
      bannerHidden: overlay.querySelector("#kyso-w-banner").checked,
      gearAlwaysVisible: buttonsAlways,
      lorAlwaysVisible: buttonsAlways,
      profileBgTransparent: overlay.querySelector("#kyso-w-profilebg").checked,
      socialBlur: Number(sv.value) || 0,
      hasSeenWelcome: true,
    };
    saveSettings(next);
    applyAllSettings(next);
    close();
  });
}
```

- [ ] **Step 2: Trigger it from `initSettingsPage`**

In `initSettingsPage` (L3174–3225), after the existing `applyAllSettings(...)` call (~L3203), add:

```js
  const _s = { ...DEFAULTS, ...loadSettings() };
  if (!_s.hasSeenWelcome) {
    // Defer until body is ready so the overlay mounts visibly.
    if (document.body) showWelcomeModal();
    else window.addEventListener("load", showWelcomeModal, { once: true });
  }
```

- [ ] **Step 3: Add modal styles to ThemeSettings.css**

Append to `utilsCss/ThemeSettings.css`:

```css
/* ── Kyso UI Editor welcome modal ─────────────────────────────────────── */
#kyso-welcome-overlay {
  position: fixed; inset: 0; z-index: 99999;
  display: flex; align-items: center; justify-content: center;
  background: rgba(0, 0, 0, 0.6);
}
.kyso-welcome-card {
  background: #0a1428; color: #f0e6d2;
  border: 1px solid var(--kyso-accent, #c89b3c);
  border-radius: 8px; padding: 24px 28px; width: 420px; max-width: 90vw;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.6);
  font-family: "Open Sans", sans-serif;
}
.kyso-welcome-title { margin: 0 0 4px; font-size: 20px; color: var(--kyso-accent, #c89b3c); }
.kyso-welcome-sub { margin: 0 0 18px; font-size: 12px; opacity: 0.8; }
.kyso-welcome-row {
  display: flex; align-items: center; gap: 10px;
  padding: 8px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}
.kyso-welcome-row > span { flex: 1; font-size: 13px; }
.kyso-welcome-row > small { width: 90px; font-size: 11px; opacity: 0.7; text-align: right; }
.kyso-welcome-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 18px; }
.kyso-welcome-actions .kyso-btn {
  padding: 8px 18px; border-radius: 4px; cursor: pointer;
  border: 1px solid var(--kyso-accent, #c89b3c); background: transparent; color: #f0e6d2;
}
.kyso-welcome-actions .kyso-btn--primary { background: var(--kyso-accent, #c89b3c); color: #0a1428; }
```

(If `.kyso-btn` already exists in this file with adequate styling, keep the modal-specific rules and drop duplicates.)

- [ ] **Step 4: Verify JS syntax**

Run: `node --check "C:/Program Files/Pengu Loader/plugins/KysoTheme/settingsPage.js"`
Expected: no output, exit 0.

- [ ] **Step 5: Manual verify (in client)**

Simulate first run: console `DataStore.set("KysoTheme.settings", JSON.stringify({})); location.reload();` — the welcome modal appears once. Choose options + Apply → settings take effect and modal does not reappear on reload. Repeat with Skip → no changes, modal gone for good. Record result.

- [ ] **Step 6: Commit**

```bash
git add settingsPage.js utilsCss/ThemeSettings.css
git commit -m "feat(onboarding): first-run welcome modal"
```

---

### Task 9: Rename to "Kyso UI Editor v3.1"

**Files:**
- Modify: `index.js` (header comment L1–6), `settingsPage.js` (panel title/version label), `README.MD` (title)

**Interfaces:**
- Display-only. No code identifiers, folder, asset base, or `STORE_KEY` change.

- [ ] **Step 1: Update index.js header**

In `index.js` L1–6, change:

```js
/*
 * @name Kyso UI Editor v3.1
 * @author Kyso
 * @description Kyso UI Editor — customizable clean theme for League of Legends (Pengu Loader)
 * @link https://github.com/kyso1/KysoTheme
 */
```

- [ ] **Step 2: Update the panel title in settingsPage.js**

In `buildSettingsPanel`, find the header title text (~L2093–2096, currently rendering the title + `v3.0`). Change the visible title to `Kyso UI Editor` and the version label to `v3.1`. (Search the template for `v3.0` and for the existing title string; replace those literals. Do NOT change the injected tab label id logic or `STORE_KEY`.)

- [ ] **Step 3: Update README.MD title**

In `README.MD`, change the top H1 title to `Kyso UI Editor` (keep repo/links/folder references that point at `KysoTheme` unchanged).

- [ ] **Step 4: Verify JS syntax**

Run: `node --check "C:/Program Files/Pengu Loader/plugins/KysoTheme/index.js"` and `node --check "C:/Program Files/Pengu Loader/plugins/KysoTheme/settingsPage.js"`
Expected: no output, exit 0 for both.

- [ ] **Step 5: Manual verify (in client)**

Reload — Pengu plugin list / settings tab shows "Kyso UI Editor"; settings header shows `v3.1`. Custom assets and saved settings still load (folder/key unchanged). Record result.

- [ ] **Step 6: Commit**

```bash
git add index.js settingsPage.js README.MD
git commit -m "chore: rename display to Kyso UI Editor v3.1"
```

---

## Self-Review

**Spec coverage** (each spec § → task):
- §0 keys → Task 1. §1 navbar icon → Task 5. §2 profile bg → Task 3. §3 gear/LoR → Task 2 (overrides) + Task 7 (UI). §4 banner hide → Task 4. §5 play button → Task 2. §6 social blur → Task 6. §7 welcome modal → Task 8. §8 Interface section → Task 7. §9 rename → Task 9. §10 applyAllSettings additions → distributed across Tasks 2–6 (each wires its own call). Testing checklist → per-task manual-verify steps. ✓ All covered.

**Placeholder scan:** No "TBD/TODO/implement later." The only investigation is Task 3 Step 1 (live selector inspection) — it ships a working broad-selector fallback, so it is not a blocking placeholder. ✓

**Type/name consistency:** `applyInterfaceToggles(settings)`, `applyProfileBgTransparent(hidden)`, `applyBannerVisibility(hidden)`, `applyIcon(url, allPlayers, syncNavbar)`, `applySocialBlur(px)`, `showWelcomeModal()`, `_playButtonThemedCss(opacity, blur)`, globals `window.__kysoSocialBlur` / `window.__kysoRescrub`. Setting keys identical across DEFAULTS (Task 1), UI ids (Task 7), save-all (Task 7), modal (Task 8). DOM ids `kyso-*` consistent between template, toggles[], slider wiring, and save-all. ✓

**Dependency order:** 1 (keys) → 2–6 (apply fns, each self-wiring into applyAllSettings) → 7 (UI consumes apply fns) → 8 (modal consumes apply fns) → 9 (rename, independent). ✓

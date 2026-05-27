# Asset Replacers Implementation Plan (PR A)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add manifest-driven directory listing + Local/Web source switch for 6 visual asset categories (background, banner, crest, profile icon, loading background, loading icon) and wire loading-screen assets through the settings system instead of hardcoded CSS paths.

**Architecture:** A new `assetReplacers.js` module owns DOM mutation logic for each category (idempotent, with persistent MutationObservers for shadow-root targets). `settingsPage.js` keeps DataStore / DEFAULTS / migration / UI responsibilities and calls into the module with already-resolved URLs. A new `assets/manifest.json` enumerates locally-available files per category.

**Tech Stack:** Pengu Loader plugin (vanilla ES modules), DataStore-backed settings, Shadow DOM injection, MutationObserver-driven re-application.

**Spec reference:** `docs/superpowers/specs/2026-05-27-asset-replacers-design.md`

**Conventions for this codebase:**
- No JS test runner is set up. Verification is `node --check <file>` for syntax + manual checks in the LoL client.
- All source paths are absolute Windows paths under `C:\Program Files\Pengu Loader\plugins\KysoTheme\`.
- Commit messages follow: `<type>: <subject>` (e.g. `feat:`, `refactor:`, `chore:`).
- After every task, commit. Frequent commits.

---

## Phase 1 — Manifest + Module Skeleton

### Task 1: Create `assets/manifest.json`

**Files:**
- Create: `assets/manifest.json`

- [ ] **Step 1: Write manifest with seed data**

Write to `C:\Program Files\Pengu Loader\plugins\KysoTheme\assets\manifest.json`:

```json
{
  "version": 1,
  "categories": {
    "backgrounds": [
      { "label": "Default Static", "path": "Main/background.jpg" },
      { "label": "Default Animated", "path": "Main/background.gif" },
      { "label": "Main Alt 1", "path": "Main/1.jpg" },
      { "label": "Main Alt 2", "path": "Main/2.jpg" },
      { "label": "Collections 22", "path": "Collections/collections-bg22.jpg" },
      { "label": "Champ Select & Runes", "path": "Runes and Select/champ-select-and-runes.jpg" },
      { "label": "Runes Alt 1", "path": "Runes and Select/1.jpg" },
      { "label": "Mode Switcher", "path": "ModeSwitcher/switch.jpg" },
      { "label": "Mode Switcher Alt", "path": "ModeSwitcher/switch1.jpg" }
    ],
    "banners": [],
    "crests": [],
    "profileIcons": [],
    "loadingBackgrounds": [
      { "label": "Default", "path": "Loading Screen/loading-background.jpg" },
      { "label": "Alt 1", "path": "Loading Screen/1.jpg" }
    ],
    "loadingIcons": [
      { "label": "Default", "path": "Loading Screen/loading-icon.gif" }
    ]
  }
}
```

- [ ] **Step 2: Verify file is valid JSON**

Run: `node -e "JSON.parse(require('fs').readFileSync('C:/Program Files/Pengu Loader/plugins/KysoTheme/assets/manifest.json', 'utf8'))"`
Expected: no output, exit code 0.

- [ ] **Step 3: Commit**

```bash
git add "assets/manifest.json"
git commit -m "feat(assets): add manifest.json with seeded entries for all 6 categories"
```

---

### Task 2: Create `assetReplacers.js` with `pluginAsset` + `loadManifest`

**Files:**
- Create: `assetReplacers.js`

- [ ] **Step 1: Write module skeleton**

Write to `C:\Program Files\Pengu Loader\plugins\KysoTheme\assetReplacers.js`:

```js
// Pure module — DOM mutation + manifest loading. No DataStore / i18n / DEFAULTS coupling.
// Callers pass already-resolved URLs (empty string = clear override).

const PLUGIN_NAME = "KysoTheme";
const PLUGIN_ASSETS_BASE = `//plugins/${PLUGIN_NAME}/assets/`;

export function pluginAsset(relPath) {
  if (!relPath) return "";
  return PLUGIN_ASSETS_BASE + String(relPath).replace(/^\/+/, "");
}

let _manifestCache = null;
let _manifestPromise = null;

export function loadManifest() {
  if (_manifestCache) return Promise.resolve(_manifestCache);
  if (_manifestPromise) return _manifestPromise;
  const fallback = {
    version: 1,
    categories: {
      backgrounds: [],
      banners: [],
      crests: [],
      profileIcons: [],
      loadingBackgrounds: [],
      loadingIcons: [],
    },
  };
  _manifestPromise = fetch(PLUGIN_ASSETS_BASE + "manifest.json")
    .then((r) => (r.ok ? r.json() : Promise.reject(new Error("HTTP " + r.status))))
    .then((data) => {
      // Defensive fill of missing categories
      const cats = data?.categories || {};
      for (const k of Object.keys(fallback.categories)) {
        if (!Array.isArray(cats[k])) cats[k] = [];
      }
      _manifestCache = { version: data?.version || 1, categories: cats };
      return _manifestCache;
    })
    .catch((e) => {
      console.warn("[KysoTheme] manifest.json load failed:", e);
      _manifestCache = fallback;
      return _manifestCache;
    });
  return _manifestPromise;
}

// Shared helper: ensures a <style id> element exists in given root, returns it.
function ensureStyleIn(root, id) {
  if (!root) return null;
  let style = root.querySelector("#" + id);
  if (!style) {
    style = document.createElement("style");
    style.id = id;
    root.appendChild(style);
  }
  return style;
}
```

- [ ] **Step 2: Syntax check**

Run: `node --check "C:/Program Files/Pengu Loader/plugins/KysoTheme/assetReplacers.js"`
Expected: no output, exit code 0.

- [ ] **Step 3: Commit**

```bash
git add assetReplacers.js
git commit -m "feat(assetReplacers): module skeleton with pluginAsset + loadManifest"
```

---

### Task 3: Add `applyProfileIcon` (self-only)

**Files:**
- Modify: `assetReplacers.js` (append)

- [ ] **Step 1: Append function**

Append to `assetReplacers.js`:

```js
// applyProfileIcon — self-only. Touches profile page crest + sidebar avatar.
// Empty URL → skip mutations (lets Riot default render).
let _profileIconObserver = null;
let _currentProfileIconUrl = "";

function _updateProfileIconDom(url) {
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
  // Sidebar avatar (light DOM)
  const sidebarIcon = document.querySelector(
    "lol-social-avatar .summoner-level-icon .icon-image",
  );
  if (sidebarIcon) {
    if (sidebarIcon.tagName === "IMG") {
      if (sidebarIcon.getAttribute("src") !== url) sidebarIcon.setAttribute("src", url);
    } else {
      const cur = sidebarIcon.style.backgroundImage || "";
      const next = `url("${url}")`;
      if (cur !== next) {
        sidebarIcon.style.backgroundImage = next;
        sidebarIcon.style.backgroundSize = "cover";
        sidebarIcon.style.backgroundPosition = "center";
      }
    }
  }
}

export function applyProfileIcon(url) {
  _currentProfileIconUrl = url || "";
  if (_profileIconObserver) _profileIconObserver.disconnect();
  if (!_currentProfileIconUrl) return; // empty → leave Riot default

  _updateProfileIconDom(_currentProfileIconUrl);
  _profileIconObserver = new MutationObserver(() => {
    _updateProfileIconDom(_currentProfileIconUrl);
  });
  _profileIconObserver.observe(document.body, { childList: true, subtree: true });
}
```

- [ ] **Step 2: Syntax check**

Run: `node --check "C:/Program Files/Pengu Loader/plugins/KysoTheme/assetReplacers.js"`
Expected: no output, exit code 0.

- [ ] **Step 3: Commit**

```bash
git add assetReplacers.js
git commit -m "feat(assetReplacers): add applyProfileIcon with self-only scope"
```

---

### Task 4: Add `applyBanner` (shadow-root style injection)

**Files:**
- Modify: `assetReplacers.js` (append)

- [ ] **Step 1: Append function**

Append to `assetReplacers.js`:

```js
// applyBanner — injects override style into the banner element's shadow root.
// Selectors are broad to survive minor Riot rendering changes.
let _bannerObserver = null;
let _currentBannerUrl = "";

function _updateBannerDom(url) {
  const profile = document.querySelector("lol-regalia-profile-v2-element");
  if (!profile || !profile.shadowRoot) return;
  const banner = profile.shadowRoot.querySelector("lol-regalia-banner-v2-element");
  if (!banner || !banner.shadowRoot) return;
  const style = ensureStyleIn(banner.shadowRoot, "kyso-banner-override");
  if (!style) return;
  style.textContent = url
    ? `:host, :host > div, .banner, [class*="banner"] {
         background-image: url("${url}") !important;
         background-size: cover !important;
         background-position: center !important;
       }`
    : "";
}

export function applyBanner(url) {
  _currentBannerUrl = url || "";
  if (_bannerObserver) _bannerObserver.disconnect();
  _updateBannerDom(_currentBannerUrl);
  _bannerObserver = new MutationObserver(() => {
    _updateBannerDom(_currentBannerUrl);
  });
  _bannerObserver.observe(document.body, { childList: true, subtree: true });
}
```

- [ ] **Step 2: Syntax check**

Run: `node --check "C:/Program Files/Pengu Loader/plugins/KysoTheme/assetReplacers.js"`
Expected: no output, exit code 0.

- [ ] **Step 3: Commit**

```bash
git add assetReplacers.js
git commit -m "feat(assetReplacers): add applyBanner via shadow-root style injection"
```

---

### Task 5: Add `applyCrest` (shadow-root style injection)

**Files:**
- Modify: `assetReplacers.js` (append)

- [ ] **Step 1: Append function**

Append to `assetReplacers.js`:

```js
// applyCrest — injects override style into the crest element's shadow root.
let _crestObserver = null;
let _currentCrestUrl = "";

function _updateCrestDom(url) {
  const profile = document.querySelector("lol-regalia-profile-v2-element");
  if (!profile || !profile.shadowRoot) return;
  const crest = profile.shadowRoot.querySelector("lol-regalia-crest-v2-element");
  if (!crest || !crest.shadowRoot) return;
  const style = ensureStyleIn(crest.shadowRoot, "kyso-crest-override");
  if (!style) return;
  style.textContent = url
    ? `:host, :host > div, .crest, [class*="crest"] {
         background-image: url("${url}") !important;
         background-size: contain !important;
         background-position: center !important;
         background-repeat: no-repeat !important;
       }`
    : "";
}

export function applyCrest(url) {
  _currentCrestUrl = url || "";
  if (_crestObserver) _crestObserver.disconnect();
  _updateCrestDom(_currentCrestUrl);
  _crestObserver = new MutationObserver(() => {
    _updateCrestDom(_currentCrestUrl);
  });
  _crestObserver.observe(document.body, { childList: true, subtree: true });
}
```

- [ ] **Step 2: Syntax check**

Run: `node --check "C:/Program Files/Pengu Loader/plugins/KysoTheme/assetReplacers.js"`
Expected: no output, exit code 0.

- [ ] **Step 3: Commit**

```bash
git add assetReplacers.js
git commit -m "feat(assetReplacers): add applyCrest via shadow-root style injection"
```

---

### Task 6: Add `applyLoadingScreen` (document-level style)

**Files:**
- Modify: `assetReplacers.js` (append)

- [ ] **Step 1: Append function**

Append to `assetReplacers.js`:

```js
// applyLoadingScreen — single <style id="kyso-loading-style"> in document.head.
// Empty URL for either field omits the corresponding rule.
// Both empty → remove the element entirely.
export function applyLoadingScreen({ bgUrl, iconUrl }) {
  const id = "kyso-loading-style";
  let style = document.head.querySelector("#" + id);
  if (!bgUrl && !iconUrl) {
    if (style) style.remove();
    return;
  }
  if (!style) {
    style = document.createElement("style");
    style.id = id;
    document.head.appendChild(style);
  }
  const parts = [];
  if (bgUrl) {
    parts.push(
      `.lol-loading-screen-container.lol-loading-screen-default-state {
         background: url("${bgUrl}") #000000 center/cover no-repeat !important;
         background-size: cover !important;
         background-position: center center !important;
         opacity: 0.2px !important;
       }`,
    );
  }
  if (iconUrl) {
    parts.push(
      `.lol-loading-screen-lol-icon {
         background-image: url("${iconUrl}") !important;
         width: 200px !important;
         height: 200px !important;
         border-radius: 2px !important;
       }`,
    );
  }
  style.textContent = parts.join("\n");
}
```

- [ ] **Step 2: Syntax check**

Run: `node --check "C:/Program Files/Pengu Loader/plugins/KysoTheme/assetReplacers.js"`
Expected: no output, exit code 0.

- [ ] **Step 3: Commit**

```bash
git add assetReplacers.js
git commit -m "feat(assetReplacers): add applyLoadingScreen with document-level style injection"
```

---

## Phase 2 — Settings Backend Wiring

### Task 7: Update `DEFAULTS` in `settingsPage.js`

**Files:**
- Modify: `settingsPage.js:589-611`

- [ ] **Step 1: Edit DEFAULTS block**

Replace the `DEFAULTS` object at `settingsPage.js:589-611` with this version (adds new triples; removes `iconAllPlayers`; keeps `backgroundUrl` and `iconUrl` as legacy mirrors):

```js
const DEFAULTS = {
  // Legacy mirrors (write-only after migration — never read internally)
  backgroundUrl: "",
  iconUrl: "",
  // Background — Local|Web triple
  backgroundSource: "local",
  backgroundLocal: "Main/background.jpg",
  backgroundWeb: "",
  backgroundType: "auto", // "auto" | "gif" | "image" | "video"
  // Banner
  bannerSource: "local",
  bannerLocal: "",
  bannerWeb: "",
  // Crest
  crestSource: "local",
  crestLocal: "",
  crestWeb: "",
  // Profile icon (self-only — no allPlayers toggle)
  profileIconSource: "local",
  profileIconLocal: "",
  profileIconWeb: "",
  // Loading screen
  loadingBgSource: "local",
  loadingBgLocal: "Loading Screen/loading-background.jpg",
  loadingBgWeb: "",
  loadingIconSource: "local",
  loadingIconLocal: "Loading Screen/loading-icon.gif",
  loadingIconWeb: "",
  // Visibility / hide features
  hideRP: false,
  hideHoverElements: false,
  hideTFT: false,
  hideSocialOnly: false,
  hideSocialPanel: false,
  fontUrl: "",
  fontFamily: "",
  // Sliding-door hide-navbar
  enableHideNavbarBtn: false,
  navbarHidden: false,
  showBlueEssenceOnHide: false,
  // Sliding-door hide-social-panel
  enableHideSocialBtn: false,
  socialHidden: false,
  // Color accent
  accentColor: "",
  accentAuto: false,
};
```

Use the Edit tool with `old_string` matching the existing DEFAULTS block exactly (from `const DEFAULTS = {` through the closing `};` line 611 inclusive).

- [ ] **Step 2: Syntax check**

Run: `node --check "C:/Program Files/Pengu Loader/plugins/KysoTheme/settingsPage.js"`
Expected: no output, exit code 0.

- [ ] **Step 3: Commit**

```bash
git add settingsPage.js
git commit -m "feat(settings): add Local/Web triples for 6 asset categories; remove iconAllPlayers"
```

---

### Task 8: Add `migrateSettings` and call it from `initSettingsPage`

**Files:**
- Modify: `settingsPage.js`

- [ ] **Step 1: Find `initSettingsPage` (it's near the end of the file)**

Run: `grep -n "export function initSettingsPage" "C:/Program Files/Pengu Loader/plugins/KysoTheme/settingsPage.js"`
Note the line number; you'll insert above it.

- [ ] **Step 2: Insert migration helper before `initSettingsPage`**

Add immediately above the `export function initSettingsPage(` line:

```js
// Migrates legacy keys (backgroundUrl, iconUrl, iconAllPlayers) into the new
// Local/Web triples. Runs once per boot; idempotent — re-running with new
// keys present is a no-op for those keys.
function migrateSettings(saved) {
  if (!saved || typeof saved !== "object") return saved;
  const out = { ...saved };

  // Drop removed key silently
  if (out.iconAllPlayers !== undefined) delete out.iconAllPlayers;

  const ASSETS_PREFIX = "//plugins/KysoTheme/assets/";

  // Background migration
  if (out.backgroundUrl && out.backgroundSource === undefined) {
    if (out.backgroundUrl.startsWith(ASSETS_PREFIX)) {
      out.backgroundSource = "local";
      out.backgroundLocal = out.backgroundUrl.slice(ASSETS_PREFIX.length);
    } else {
      out.backgroundSource = "web";
      out.backgroundWeb = out.backgroundUrl;
    }
  }

  // Profile icon migration (iconUrl is the legacy field)
  if (out.iconUrl && out.profileIconSource === undefined) {
    if (out.iconUrl.startsWith(ASSETS_PREFIX)) {
      out.profileIconSource = "local";
      out.profileIconLocal = out.iconUrl.slice(ASSETS_PREFIX.length);
    } else {
      out.profileIconSource = "web";
      out.profileIconWeb = out.iconUrl;
    }
  }

  return out;
}
```

- [ ] **Step 3: Find where `initSettingsPage` reads settings**

Within `initSettingsPage`, locate the first call that reads saved settings (typically `let saved = loadSettings();` or `JSON.parse(DataStore.get(...))`). Use `grep -n "loadSettings\|DataStore.get" settingsPage.js | head -20` to find candidates.

- [ ] **Step 4: Wrap the first-read with migration + save-back**

Inside `initSettingsPage`, immediately after the initial settings load (where `saved` is assigned), insert:

```js
const _migrated = migrateSettings(saved);
if (JSON.stringify(_migrated) !== JSON.stringify(saved)) {
  saveSettings(_migrated);
  saved = _migrated;
}
```

(If `saveSettings` doesn't already exist under that name in the file, look at the existing save call near `DataStore.set` and reuse it — name may be `saveSettings`, `writeSettings`, or inline `DataStore.set("KysoTheme.settings", JSON.stringify(...))`. Use whatever the file already uses.)

- [ ] **Step 5: Syntax check**

Run: `node --check "C:/Program Files/Pengu Loader/plugins/KysoTheme/settingsPage.js"`
Expected: no output, exit code 0.

- [ ] **Step 6: Commit**

```bash
git add settingsPage.js
git commit -m "feat(settings): add migrateSettings; convert legacy backgroundUrl/iconUrl into Local/Web triples"
```

---

### Task 9: Add `resolveAsset` helper + import `assetReplacers`

**Files:**
- Modify: `settingsPage.js`

- [ ] **Step 1: Add import at the top of `settingsPage.js`**

Find the top of the file (first existing `import` statement, around line 1-15). Add immediately after the last existing import:

```js
import * as assetReplacers from "./assetReplacers.js";
```

If `settingsPage.js` has no imports yet (it may be CommonJS-style or rely on globals), add it as the first line of the file.

- [ ] **Step 2: Add `resolveAsset` helper near `pluginAsset`**

`pluginAsset` is at `settingsPage.js:646`. Add directly below it (around line 650):

```js
// Resolves a {cat}Source/{cat}Local/{cat}Web triple into a final URL.
// cat = "background" | "banner" | "crest" | "profileIcon" | "loadingBg" | "loadingIcon"
function resolveAsset(cat, settings) {
  const source = settings[cat + "Source"];
  if (source === "web") return settings[cat + "Web"] || "";
  const local = settings[cat + "Local"] || "";
  return local ? pluginAsset(local) : "";
}
```

- [ ] **Step 3: Syntax check**

Run: `node --check "C:/Program Files/Pengu Loader/plugins/KysoTheme/settingsPage.js"`
Expected: no output, exit code 0.

- [ ] **Step 4: Commit**

```bash
git add settingsPage.js
git commit -m "feat(settings): import assetReplacers + add resolveAsset helper"
```

---

### Task 10: Rewrite `applyAllSettings` to use the new pipeline

**Files:**
- Modify: `settingsPage.js:1278-1294`

- [ ] **Step 1: Replace `applyAllSettings` body**

Use Edit tool with `old_string`:

```js
export function applyAllSettings(settings) {
  const merged = { ...DEFAULTS, ...settings };
  applyBackground(merged.backgroundUrl, merged.backgroundType);
  applyFont(merged.fontUrl, merged.fontFamily);
  applyHideOptions(merged);
  applyIcon(merged.iconUrl, merged.iconAllPlayers);
  applyHideNavbarBtnSetting(merged);
  applyHideSocialBtnSetting(merged);
  // Color accent
  if (merged.accentAuto) {
    extractAccentFromBackground(merged.backgroundUrl).then((hex) =>
      applyAccentColor(hex),
    );
  } else {
    applyAccentColor(merged.accentColor || "");
  }
}
```

And `new_string`:

```js
export function applyAllSettings(settings) {
  const merged = { ...DEFAULTS, ...settings };
  const bgUrl = resolveAsset("background", merged);
  applyBackground(bgUrl, merged.backgroundType);
  applyFont(merged.fontUrl, merged.fontFamily);
  applyHideOptions(merged);
  // Asset replacers — self-only profile icon, no global CSS path
  assetReplacers.applyBanner(resolveAsset("banner", merged));
  assetReplacers.applyCrest(resolveAsset("crest", merged));
  assetReplacers.applyProfileIcon(resolveAsset("profileIcon", merged));
  assetReplacers.applyLoadingScreen({
    bgUrl: resolveAsset("loadingBg", merged),
    iconUrl: resolveAsset("loadingIcon", merged),
  });
  applyHideNavbarBtnSetting(merged);
  applyHideSocialBtnSetting(merged);
  // Color accent — still uses resolved bgUrl for auto-extraction
  if (merged.accentAuto) {
    extractAccentFromBackground(bgUrl).then((hex) => applyAccentColor(hex));
  } else {
    applyAccentColor(merged.accentColor || "");
  }
}
```

- [ ] **Step 2: Syntax check**

Run: `node --check "C:/Program Files/Pengu Loader/plugins/KysoTheme/settingsPage.js"`
Expected: no output, exit code 0.

- [ ] **Step 3: Commit**

```bash
git add settingsPage.js
git commit -m "refactor(settings): route applyAllSettings through resolveAsset + assetReplacers"
```

---

### Task 11: Delete `applyIcon` and `updateIconInDOM`

**Files:**
- Modify: `settingsPage.js:1218-1276` (delete)

- [ ] **Step 1: Confirm functions are unreferenced**

Run: `grep -nE "applyIcon\(|updateIconInDOM\(" "C:/Program Files/Pengu Loader/plugins/KysoTheme/settingsPage.js"`
Expected: only the function definitions themselves at lines 1218 and 1241 (no other callers — Task 10 removed the only call site).

- [ ] **Step 2: Delete both functions**

Use Edit tool to remove lines 1218-1276 inclusive (the entire `function applyIcon(...)` block and the `function updateIconInDOM(...)` block immediately after it). The `old_string` should start at `function applyIcon(url, allPlayers = false) {` and end at the closing `}` of `updateIconInDOM`.

- [ ] **Step 3: Verify no dangling references**

Run: `grep -nE "applyIcon|updateIconInDOM|iconAllPlayers|iconBlock|KYSO-ICON" "C:/Program Files/Pengu Loader/plugins/KysoTheme/settingsPage.js"`
Expected: no matches (or only matches inside comments / i18n strings that don't reference the removed code).

- [ ] **Step 4: Syntax check**

Run: `node --check "C:/Program Files/Pengu Loader/plugins/KysoTheme/settingsPage.js"`
Expected: no output, exit code 0.

- [ ] **Step 5: Commit**

```bash
git add settingsPage.js
git commit -m "refactor(settings): remove applyIcon + updateIconInDOM (now in assetReplacers)"
```

---

### Task 12: Strip hardcoded loading-screen URLs from `theme.css`

**Files:**
- Modify: `main-theme/theme.css:434-449`

- [ ] **Step 1: Edit the loading-screen container rule**

Use Edit tool to replace:

```css
.lol-loading-screen-container.lol-loading-screen-default-state {
  /* background: #1a1580 !important; */
  opacity: 0.2px !important;
  /* filter: blur(0.5px); */
  background: url("../assets/Loading Screen/loading-background.jpg") #000000
    no-repeat !important ;
  background-size: cover !important;
  background-position: center center;
  background-repeat: no-repeat;
}
.lol-loading-screen-lol-icon {
  background-image: url("../assets/Loading Screen/loading-icon.gif") !important;
  width: 200px !important;
  height: 200px !important;
  border-radius: 2px !important;
}
```

with:

```css
/* Loading screen background + icon are now injected at runtime by
   assetReplacers.applyLoadingScreen() from user settings. Spinner /
   status-container layout-only rules below remain. */
```

(The `.lol-loading-screen-spinner` and `.lol-loading-screen-status-container` rules at lines 450-461 stay — they're layout, not user-replaceable.)

- [ ] **Step 2: Verify removal**

Run: `grep -n "loading-background.jpg\|loading-icon.gif" "C:/Program Files/Pengu Loader/plugins/KysoTheme/main-theme/theme.css"`
Expected: no matches.

- [ ] **Step 3: Commit**

```bash
git add main-theme/theme.css
git commit -m "refactor(theme): remove hardcoded loading-screen asset URLs (now runtime-injected)"
```

---

### Task 13: Remove `changeIcon` from `index.js`

**Files:**
- Modify: `index.js`

- [ ] **Step 1: Delete the `changeIcon` function**

Delete the entire function body at `index.js:282-349` (`function changeIcon() { ... }` through its closing brace).

- [ ] **Step 2: Delete the call sites**

Search and remove:
- `index.js:236` — line `changeIcon();` inside `loadHomePage`
- `index.js:265` — line `changeIcon();` inside the `DOMContentLoaded` listener at line 263
- `index.js:351-353` — the second `DOMContentLoaded` listener that only calls `changeIcon()`
- `index.js:135-143` — `getSavedIconUrl()` helper and `DEFAULT_ICON_URL` constant (no longer used)

Use targeted Edits to remove each block. Verify with grep after.

- [ ] **Step 3: Verify no remaining references**

Run: `grep -nE "changeIcon|getSavedIconUrl|DEFAULT_ICON_URL" "C:/Program Files/Pengu Loader/plugins/KysoTheme/index.js"`
Expected: no matches.

- [ ] **Step 4: Syntax check**

Run: `node --check "C:/Program Files/Pengu Loader/plugins/KysoTheme/index.js"`
Expected: no output, exit code 0.

- [ ] **Step 5: Commit**

```bash
git add index.js
git commit -m "refactor(index): remove changeIcon + helpers (delegated to assetReplacers.applyProfileIcon)"
```

---

## Phase 3 — Settings UI

### Task 14: Add i18n strings for all 6 locales

**Files:**
- Modify: `settingsPage.js` (i18n object near top, lines ~20-500)

- [ ] **Step 1: Identify the i18n object structure**

Run: `grep -n "colorSection\|fontSection\|bgSection" "C:/Program Files/Pengu Loader/plugins/KysoTheme/settingsPage.js" | head -20`
This identifies each locale block (en, pt, es, de, ja, ko). Use the `colorSection:` key as an anchor inside each locale.

- [ ] **Step 2: Append new keys to each of the 6 locale blocks**

For each locale, find the existing `bgRemove:` line and insert the following keys immediately after (translations per locale below).

**English (en)** — after `bgRemove: "Remove background",`:
```js
    assetsSection: "Player Assets",
    bannerLabel: "Banner",
    crestLabel: "Crest",
    profileIconLabel: "Profile Icon",
    loadingBgLabel: "Loading Background",
    loadingIconLabel: "Loading Icon",
    sourceLocal: "Local",
    sourceWeb: "Web",
    selectPlaceholder: "Choose...",
    noLocalAssets: "No local assets in manifest",
    resetToDefault: "Reset to default",
    webUrlPlaceholder: "https://example.com/image.png",
    applyAsset: "Apply",
```

**Portuguese (pt)**:
```js
    assetsSection: "Assets do Jogador",
    bannerLabel: "Banner",
    crestLabel: "Brasão",
    profileIconLabel: "Ícone de Perfil",
    loadingBgLabel: "Fundo da Tela de Loading",
    loadingIconLabel: "Ícone da Tela de Loading",
    sourceLocal: "Local",
    sourceWeb: "Web",
    selectPlaceholder: "Escolher...",
    noLocalAssets: "Nenhum asset local no manifest",
    resetToDefault: "Restaurar padrão",
    webUrlPlaceholder: "https://exemplo.com/imagem.png",
    applyAsset: "Aplicar",
```

**Spanish (es)**:
```js
    assetsSection: "Recursos del Jugador",
    bannerLabel: "Banner",
    crestLabel: "Escudo",
    profileIconLabel: "Icono de Perfil",
    loadingBgLabel: "Fondo de Carga",
    loadingIconLabel: "Icono de Carga",
    sourceLocal: "Local",
    sourceWeb: "Web",
    selectPlaceholder: "Elegir...",
    noLocalAssets: "Sin recursos locales en el manifest",
    resetToDefault: "Restablecer",
    webUrlPlaceholder: "https://ejemplo.com/imagen.png",
    applyAsset: "Aplicar",
```

**German (de)**:
```js
    assetsSection: "Spieler-Assets",
    bannerLabel: "Banner",
    crestLabel: "Wappen",
    profileIconLabel: "Profilsymbol",
    loadingBgLabel: "Ladebildschirm-Hintergrund",
    loadingIconLabel: "Ladebildschirm-Symbol",
    sourceLocal: "Lokal",
    sourceWeb: "Web",
    selectPlaceholder: "Auswählen...",
    noLocalAssets: "Keine lokalen Assets im Manifest",
    resetToDefault: "Auf Standard zurücksetzen",
    webUrlPlaceholder: "https://beispiel.de/bild.png",
    applyAsset: "Anwenden",
```

**Japanese (ja)**:
```js
    assetsSection: "プレイヤーアセット",
    bannerLabel: "バナー",
    crestLabel: "クレスト",
    profileIconLabel: "プロフィールアイコン",
    loadingBgLabel: "ロード画面の背景",
    loadingIconLabel: "ロード画面のアイコン",
    sourceLocal: "ローカル",
    sourceWeb: "Web",
    selectPlaceholder: "選択...",
    noLocalAssets: "マニフェストにローカルアセットがありません",
    resetToDefault: "デフォルトに戻す",
    webUrlPlaceholder: "https://example.com/image.png",
    applyAsset: "適用",
```

**Korean (ko)**:
```js
    assetsSection: "플레이어 에셋",
    bannerLabel: "배너",
    crestLabel: "문장",
    profileIconLabel: "프로필 아이콘",
    loadingBgLabel: "로딩 화면 배경",
    loadingIconLabel: "로딩 화면 아이콘",
    sourceLocal: "로컬",
    sourceWeb: "웹",
    selectPlaceholder: "선택...",
    noLocalAssets: "매니페스트에 로컬 에셋 없음",
    resetToDefault: "기본값으로 재설정",
    webUrlPlaceholder: "https://example.com/image.png",
    applyAsset: "적용",
```

- [ ] **Step 3: Syntax check**

Run: `node --check "C:/Program Files/Pengu Loader/plugins/KysoTheme/settingsPage.js"`
Expected: no output, exit code 0.

- [ ] **Step 4: Commit**

```bash
git add settingsPage.js
git commit -m "i18n: add Player Assets section strings for en/pt/es/de/ja/ko"
```

---

### Task 15: Add asset-block builder helper

**Files:**
- Modify: `settingsPage.js`

- [ ] **Step 1: Place the helper near `pluginAsset` / `resolveAsset`**

Add immediately after `resolveAsset` (added in Task 9):

```js
// Builds the HTML for one asset category block.
// cat is the prefix used in DEFAULTS keys: e.g. "banner" → bannerSource/bannerLocal/bannerWeb.
// labelKey is the i18n key for the section heading: e.g. "bannerLabel".
// manifestEntries is the array from manifest.categories[<cat plural>].
function buildAssetBlock(cat, labelKey, manifestEntries, settings) {
  const source = settings[cat + "Source"] || "local";
  const local = settings[cat + "Local"] || "";
  const web = settings[cat + "Web"] || "";

  const options = manifestEntries.length
    ? `<option value="">— ${t("selectPlaceholder")} —</option>` +
      manifestEntries
        .map(
          (e) =>
            `<option value="${e.path}" ${e.path === local ? "selected" : ""}>${e.label}</option>`,
        )
        .join("")
    : `<option value="">${t("noLocalAssets")}</option>`;

  return `
    <div class="kyso-asset-block" data-cat="${cat}">
      <h4 class="kyso-asset-block-title">${t(labelKey)}</h4>
      <div class="kyso-settings-row kyso-asset-source-row">
        <label class="kyso-radio">
          <input type="radio" name="kyso-${cat}-source" value="local" ${source === "local" ? "checked" : ""}>
          <span>${t("sourceLocal")}</span>
        </label>
        <label class="kyso-radio">
          <input type="radio" name="kyso-${cat}-source" value="web" ${source === "web" ? "checked" : ""}>
          <span>${t("sourceWeb")}</span>
        </label>
      </div>
      <div class="kyso-settings-row kyso-asset-local-row" ${source === "local" ? "" : 'style="display:none"'}>
        <select id="kyso-${cat}-local" class="kyso-select" data-cat="${cat}">
          ${options}
        </select>
      </div>
      <div class="kyso-settings-row kyso-asset-web-row" ${source === "web" ? "" : 'style="display:none"'}>
        <input id="kyso-${cat}-web" class="kyso-input" type="text"
               placeholder="${t("webUrlPlaceholder")}"
               value="${web.replace(/"/g, "&quot;")}">
        <button class="kyso-btn kyso-btn--primary kyso-${cat}-apply" data-cat="${cat}">${t("applyAsset")}</button>
      </div>
      <div class="kyso-settings-row">
        <button class="kyso-btn kyso-btn--secondary kyso-${cat}-reset" data-cat="${cat}">${t("resetToDefault")}</button>
      </div>
    </div>
  `;
}
```

- [ ] **Step 2: Syntax check**

Run: `node --check "C:/Program Files/Pengu Loader/plugins/KysoTheme/settingsPage.js"`
Expected: no output, exit code 0.

- [ ] **Step 3: Commit**

```bash
git add settingsPage.js
git commit -m "feat(settings): add buildAssetBlock helper for category UI blocks"
```

---

### Task 16: Replace the Background section with a Player Assets section containing all 6 blocks

**Files:**
- Modify: `settingsPage.js:1484-1532`

- [ ] **Step 1: Make `buildSettingsPanel` await manifest**

Find the `buildSettingsPanel` declaration (around `settingsPage.js:1473`). Convert to `async` if not already, and load manifest as the first step:

```js
async function buildSettingsPanel() {
  const settings = { ...DEFAULTS, ...loadSettings() };
  const manifest = await assetReplacers.loadManifest();
  // ... rest unchanged
```

If `buildSettingsPanel` is called synchronously elsewhere (e.g. `const panel = buildSettingsPanel();`), update those call sites to `await` it. Run `grep -n "buildSettingsPanel(" settingsPage.js` to find callers and convert each enclosing function to async as needed.

- [ ] **Step 2: Replace the Background `<section>` (lines 1484-1532) with a Player Assets section**

Use Edit tool. `old_string` is the full block from `<!-- Background -->` through the matching `</section>`. `new_string`:

```js
    <!-- Player Assets -->
    <section class="kyso-settings-section" id="kyso-assets-section">
      <h3 class="kyso-settings-section-title">${ICONS.picture}<span>${t("assetsSection")}</span></h3>

      ${buildAssetBlock("background", "bgSection", manifest.categories.backgrounds, settings)}

      <!-- Background-specific extra: type override -->
      <div class="kyso-settings-row kyso-asset-bg-type-row">
        <label class="kyso-label" for="kyso-bg-type">${t("bgType")}</label>
        <select id="kyso-bg-type" class="kyso-select">
          <option value="auto" ${settings.backgroundType === "auto" ? "selected" : ""}>${t("bgTypeAuto")}</option>
          <option value="image" ${settings.backgroundType === "image" ? "selected" : ""}>${t("bgTypeImage")}</option>
          <option value="gif" ${settings.backgroundType === "gif" ? "selected" : ""}>${t("bgTypeGif")}</option>
          <option value="video" ${settings.backgroundType === "video" ? "selected" : ""}>${t("bgTypeVideo")}</option>
        </select>
      </div>

      ${buildAssetBlock("banner", "bannerLabel", manifest.categories.banners, settings)}
      ${buildAssetBlock("crest", "crestLabel", manifest.categories.crests, settings)}
      ${buildAssetBlock("profileIcon", "profileIconLabel", manifest.categories.profileIcons, settings)}
      ${buildAssetBlock("loadingBg", "loadingBgLabel", manifest.categories.loadingBackgrounds, settings)}
      ${buildAssetBlock("loadingIcon", "loadingIconLabel", manifest.categories.loadingIcons, settings)}
    </section>
```

This deletes the legacy upload UI, the file-input + crop-modal trigger, and the `#kyso-bg-preset` dropdown — all replaced by the unified `buildAssetBlock` output.

- [ ] **Step 3: Syntax check**

Run: `node --check "C:/Program Files/Pengu Loader/plugins/KysoTheme/settingsPage.js"`
Expected: no output, exit code 0.

- [ ] **Step 4: Commit**

```bash
git add settingsPage.js
git commit -m "feat(settings): replace Background section with unified Player Assets section (6 blocks)"
```

---

### Task 17: Wire change handlers for asset blocks

**Files:**
- Modify: `settingsPage.js`

- [ ] **Step 1: Locate the panel-event-wiring function**

There is an existing function that runs after `buildSettingsPanel` to attach event listeners — find it with `grep -n "kyso-bg-apply\|kyso-color-apply" settingsPage.js | head -10`. The wiring function is the one that contains the legacy `#kyso-bg-apply` handler.

- [ ] **Step 2: Remove the legacy bg handlers**

Inside that wiring function, delete the blocks that reference `#kyso-bg-apply`, `#kyso-bg-reset`, `#kyso-bg-url`, `#kyso-bg-preset`, `#kyso-bg-file`, `#kyso-bg-open-folder`, `#kyso-bg-filename`. The Player Assets handlers (next step) replace them. Keep `#kyso-bg-type` — it's still in the markup as the bg-extra row.

- [ ] **Step 3: Add unified handler block**

Inside the same wiring function (after removing legacy bg handlers), append:

```js
// Asset blocks — source switch, local select, web apply, reset.
// Categories use the same prefix as DEFAULTS keys.
const ASSET_CATS = ["background", "banner", "crest", "profileIcon", "loadingBg", "loadingIcon"];

ASSET_CATS.forEach((cat) => {
  // Source switch (radio buttons)
  panel.querySelectorAll(`input[name="kyso-${cat}-source"]`).forEach((radio) => {
    radio.addEventListener("change", (e) => {
      if (!e.target.checked) return;
      const newSource = e.target.value; // "local" | "web"
      const block = panel.querySelector(`.kyso-asset-block[data-cat="${cat}"]`);
      if (!block) return;
      block.querySelector(".kyso-asset-local-row").style.display = newSource === "local" ? "" : "none";
      block.querySelector(".kyso-asset-web-row").style.display = newSource === "web" ? "" : "none";
      const s = { ...DEFAULTS, ...loadSettings(), [cat + "Source"]: newSource };
      saveSettings(s);
      applyAllSettings(s);
    });
  });

  // Local <select> — auto-apply on change
  const localSelect = panel.querySelector(`#kyso-${cat}-local`);
  if (localSelect) {
    localSelect.addEventListener("change", (e) => {
      const s = { ...DEFAULTS, ...loadSettings(), [cat + "Local"]: e.target.value };
      saveSettings(s);
      applyAllSettings(s);
    });
  }

  // Web <input> + Apply button
  const webApply = panel.querySelector(`.kyso-${cat}-apply`);
  const webInput = panel.querySelector(`#kyso-${cat}-web`);
  if (webApply && webInput) {
    webApply.addEventListener("click", () => {
      const s = { ...DEFAULTS, ...loadSettings(), [cat + "Web"]: webInput.value.trim() };
      saveSettings(s);
      applyAllSettings(s);
    });
  }

  // Reset to default
  const resetBtn = panel.querySelector(`.kyso-${cat}-reset`);
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      const s = {
        ...DEFAULTS,
        ...loadSettings(),
        [cat + "Source"]: DEFAULTS[cat + "Source"],
        [cat + "Local"]: DEFAULTS[cat + "Local"],
        [cat + "Web"]: DEFAULTS[cat + "Web"],
      };
      saveSettings(s);
      applyAllSettings(s);
      // Re-render this block so UI reflects new state
      const block = panel.querySelector(`.kyso-asset-block[data-cat="${cat}"]`);
      const localRow = block?.querySelector(".kyso-asset-local-row");
      const webRow = block?.querySelector(".kyso-asset-web-row");
      const localSel = block?.querySelector(`#kyso-${cat}-local`);
      const webIn = block?.querySelector(`#kyso-${cat}-web`);
      const sourceRadios = block?.querySelectorAll(`input[name="kyso-${cat}-source"]`) || [];
      if (localSel) localSel.value = DEFAULTS[cat + "Local"];
      if (webIn) webIn.value = DEFAULTS[cat + "Web"];
      sourceRadios.forEach((r) => (r.checked = r.value === DEFAULTS[cat + "Source"]));
      if (localRow) localRow.style.display = DEFAULTS[cat + "Source"] === "local" ? "" : "none";
      if (webRow) webRow.style.display = DEFAULTS[cat + "Source"] === "web" ? "" : "none";
    });
  }
});

// Background type select stays as its own handler
const bgTypeSel = panel.querySelector("#kyso-bg-type");
if (bgTypeSel) {
  bgTypeSel.addEventListener("change", (e) => {
    const s = { ...DEFAULTS, ...loadSettings(), backgroundType: e.target.value };
    saveSettings(s);
    applyAllSettings(s);
  });
}
```

If the file uses a different save function name (not `saveSettings`), substitute it. If `loadSettings`/`saveSettings` are the actual names already in the file (likely — see Task 8 step 4), no rename needed.

- [ ] **Step 4: Add save-back of legacy mirrors**

Find the `saveSettings` function definition (or wherever `DataStore.set("KysoTheme.settings", ...)` is called from a top-level save handler). Modify it so that on every save it computes legacy mirrors:

```js
// Inside saveSettings(settings), before persisting:
const _toSave = {
  ...settings,
  // Legacy mirrors — derived from new triples so external readers still work
  backgroundUrl: resolveAsset("background", settings),
  iconUrl: resolveAsset("profileIcon", settings),
};
DataStore.set("KysoTheme.settings", JSON.stringify(_toSave));
```

If `saveSettings` is structured differently, adapt the same idea: before the actual DataStore write, compute and inject the two legacy keys.

- [ ] **Step 5: Syntax check**

Run: `node --check "C:/Program Files/Pengu Loader/plugins/KysoTheme/settingsPage.js"`
Expected: no output, exit code 0.

- [ ] **Step 6: Commit**

```bash
git add settingsPage.js
git commit -m "feat(settings): wire source-switch / local-select / web-apply / reset handlers; mirror legacy keys on save"
```

---

### Task 18: Add CSS for the new asset blocks

**Files:**
- Modify: `utilsCss/ThemeSettings.css`

- [ ] **Step 1: Locate the settings stylesheet**

Run: `grep -n "kyso-settings-section\|kyso-settings-row" "C:/Program Files/Pengu Loader/plugins/KysoTheme/utilsCss/ThemeSettings.css" | head -5`
Confirm this file holds the settings styles.

- [ ] **Step 2: Append new rules at end of file**

Append:

```css
/* Player Assets blocks (PR A) */
.kyso-asset-block {
  margin: 12px 0 18px;
  padding: 10px 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 6px;
}

.kyso-asset-block-title {
  margin: 0 0 8px;
  font-size: 13px;
  font-weight: 600;
  color: var(--kyso-accent, #ffffff);
}

.kyso-asset-source-row {
  display: flex;
  gap: 18px;
  align-items: center;
}

.kyso-radio {
  display: inline-flex;
  gap: 6px;
  align-items: center;
  cursor: pointer;
  font-size: 12px;
}

.kyso-asset-local-row .kyso-select,
.kyso-asset-web-row .kyso-input {
  flex: 1;
  min-width: 0;
}
```

- [ ] **Step 3: Verify file loads in client (no syntax check for CSS — visual only)**

Reload the LoL client; open Settings → KysoTheme. Verify the new Player Assets section renders with bordered blocks. (This is part of Task 19's manual checklist if you prefer to defer.)

- [ ] **Step 4: Commit**

```bash
git add utilsCss/ThemeSettings.css
git commit -m "style(settings): add CSS for Player Assets blocks"
```

---

## Phase 4 — Verification

### Task 19: Run full manual verification checklist

**Files:** none (verification only)

- [ ] **Step 1: All-files syntax check**

Run:
```bash
node --check "C:/Program Files/Pengu Loader/plugins/KysoTheme/assetReplacers.js"
node --check "C:/Program Files/Pengu Loader/plugins/KysoTheme/settingsPage.js"
node --check "C:/Program Files/Pengu Loader/plugins/KysoTheme/index.js"
```
Expected: all silent, exit 0.

- [ ] **Step 2: Manifest valid**

Run: `node -e "console.log(Object.keys(JSON.parse(require('fs').readFileSync('C:/Program Files/Pengu Loader/plugins/KysoTheme/assets/manifest.json','utf8')).categories))"`
Expected: `[ 'backgrounds', 'banners', 'crests', 'profileIcons', 'loadingBackgrounds', 'loadingIcons' ]`

- [ ] **Step 3: Manual — boot client**

Launch League of Legends via Pengu Loader. Expected: client boots, no JS console errors from `assetReplacers.js` or `settingsPage.js`. Default background, banner, crest, icon all look like they did before this PR (visual no-op for default values).

- [ ] **Step 4: Manual — background, Local**

Open Settings → KysoTheme → Player Assets → Background. Source = Local (default). Change dropdown to "Main Alt 1". `#kyso-global-bg` updates immediately. Reload client — selection persists.

- [ ] **Step 5: Manual — background, Web**

Switch source to Web. Paste any image URL. Click Apply. Background updates. Reload — persists.

- [ ] **Step 6: Manual — banner**

Drop a 1920x600-ish image into `assets/Banners/test.png`. Add `{ "label": "Test", "path": "Banners/test.png" }` to `manifest.json` under `banners`. Reload client. Settings → banner block → Local → "Test". Open profile page (click your icon top-right → View Profile). Banner replaced.

- [ ] **Step 7: Manual — crest**

Same flow with a transparent PNG dropped into `assets/Crests/test.png` and added to manifest. Open profile page. Crest frame replaced.

- [ ] **Step 8: Manual — profile icon**

Drop a square PNG into `assets/ProfileIcons/test.png`. Add to manifest. Apply. Profile page icon updates. Sidebar avatar (top-right circle) updates. **Open a lobby with at least one other player. Their icons remain Riot-default — not your custom icon.**

- [ ] **Step 9: Manual — loading screen**

Settings → Loading Background block → pick a manifest entry. Settings → Loading Icon block → pick one. Start a custom game. Loading screen reflects the chosen assets.

- [ ] **Step 10: Manual — migration from prior install**

Before testing this step, you need a save that has the old shape. Easiest: in DataStore (devtools `localStorage` or Pengu's DataStore), set `KysoTheme.settings` to:

```json
{ "backgroundUrl": "//plugins/KysoTheme/assets/Main/background.gif", "iconUrl": "https://i.imgur.com/test.png", "iconAllPlayers": true }
```

Reload client. Open settings. Expected:
- Background source = Local, local = `Main/background.gif`
- Profile icon source = Web, web = `https://i.imgur.com/test.png`
- No `iconAllPlayers` in saved state (verify via devtools)
- No global icon CSS injected (other players' icons unaffected)

- [ ] **Step 11: Manual — reset buttons**

Click Reset on each block. Source returns to default ("local" everywhere), local path returns to DEFAULTS value, web cleared.

- [ ] **Step 12: If all pass, commit a final note**

```bash
git commit --allow-empty -m "chore: PR A asset-replacers implementation verified end-to-end"
```

If any step fails, document the failure mode (which step, what was expected vs actual) and fix before moving on. Do not mark this task complete with failures outstanding.

---

## Self-review checklist (already performed during plan write)

- ✅ Spec coverage: tasks 1–13 cover backend (sections 3, 4, 5, 6, 8 of spec); tasks 14–18 cover UI (section 7); task 19 covers section 9 testing.
- ✅ No placeholders / TBDs in plan.
- ✅ Function name consistency: `applyBanner` / `applyCrest` / `applyProfileIcon` / `applyLoadingScreen` / `loadManifest` / `pluginAsset` / `resolveAsset` / `migrateSettings` / `buildAssetBlock` — same names used everywhere.
- ✅ DEFAULTS keys consistent: `{cat}Source` / `{cat}Local` / `{cat}Web` for `background`, `banner`, `crest`, `profileIcon`, `loadingBg`, `loadingIcon`.
- ✅ Migration is idempotent (gated on `=== undefined`).
- ✅ Legacy mirrors `backgroundUrl` / `iconUrl` are written-back on save (Task 17 step 4) so external consumers keep working.

---

## Notes for executors

- **Order matters.** Tasks 1–6 (module) must finish before Task 10 (wiring) can run without throwing. Tasks 7–9 must finish before Task 10. Task 11 (removing `applyIcon`) must come after Task 10 (which removes the only caller).
- **No tests to run** beyond `node --check` and the manual checklist. This codebase has no Jest/Mocha/Vitest harness. Don't invent one — that's out of scope.
- **Background file-upload UX is dropped** intentionally in Task 16. The new workflow is "drop file in plugin folder, edit manifest". If the user wants the upload UX back later, that's a follow-up issue, not this PR.
- **Crop modal (`openIconCropModal`)** is still in the file but no longer triggered (its call site lived in the removed bg-file handler). Don't delete it — keep for potential reuse in a future PR that wires upload + crop into the new structure.

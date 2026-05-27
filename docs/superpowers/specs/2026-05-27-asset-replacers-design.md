# PR A — Asset Replacers + Loading Screen Wiring + Background Directory Listing

**Status:** Approved design, ready for implementation plan
**Date:** 2026-05-27
**Scope:** First of 3 sliced PRs. PR B = color picker overhaul. PR C = RGB animation engine.

---

## 1. Goal

Add user-configurable visual asset replacement for KysoTheme:

- **Backgrounds** — already partially works via free URL input. Add directory dropdown (Local) alongside Web URL via source switch.
- **Banners** — new. Self-only. Shadow-root style injection.
- **Crests** — new. Self-only. Shadow-root style injection.
- **Profile icons** — already works globally (via CSS injection + `iconAllPlayers` toggle). Refactor to **self-only always**; remove the global injection path.
- **Loading screen background + icon** — currently hardcoded paths in `theme.css`. Move to runtime `<style>` injection driven by settings.

A single `assets/manifest.json` lists locally-available files per category. Each category has a `source` switch: Local (dropdown of manifest entries) or Web (free URL).

---

## 2. Non-goals

- No directory auto-scan via Pengu Loader API (none exists). Manifest is hand-edited; a future helper script can generate it.
- No changes to color picker (PR B).
- No animations (PR C).
- No support for replacing other players' banners/crests (Riot-served, not addressable via CSS).
- No npm script to regenerate manifest (future work).

---

## 3. Architecture

### 3.1 Files

| File | Action | Description |
|---|---|---|
| `assetReplacers.js` | **NEW** | Pure module: `loadManifest`, `pluginAsset`, `applyBanner`, `applyCrest`, `applyProfileIcon`, `applyLoadingScreen`. No DataStore / i18n / DEFAULTS coupling. |
| `assets/manifest.json` | **NEW** | Per-category lists of `{ label, path }` entries. |
| `settingsPage.js` | MODIFY | Add 5 new settings sections (background section refactored to same pattern); add migration; remove `iconAllPlayers` setting and `iconBlock` global CSS injection; call `assetReplacers.apply*` from `applyAllSettings`. |
| `theme.css` | MODIFY | Remove hardcoded loading-screen rules at lines 432–460. |
| `index.js` | MODIFY | Delete `changeIcon()` function (logic moves to `assetReplacers.applyProfileIcon`). |

### 3.2 Responsibility boundary

- **`assetReplacers.js`** accepts already-resolved URLs (or `""` to clear). It performs DOM mutations and installs persistent MutationObservers to re-apply when dynamic DOM appears. It does not read DataStore.
- **`settingsPage.js`** owns DataStore, DEFAULTS, i18n, UI, and migration. Resolves `source/local/web` triples into a single URL, then calls the matching apply function.
- **`manifest.json`** is the single source of truth for locally-available files.

### 3.3 Exports of `assetReplacers.js`

```js
export async function loadManifest(): Promise<Manifest>
export function pluginAsset(relPath: string): string  // "Main/bg.jpg" → "//plugins/KysoTheme/assets/Main/bg.jpg"
export function applyBanner(url: string): void
export function applyCrest(url: string): void
export function applyProfileIcon(url: string): void
export function applyLoadingScreen(opts: { bgUrl: string, iconUrl: string }): void
```

---

## 4. Settings schema

### 4.1 DEFAULTS changes

**Removed:** `iconAllPlayers`.

**Kept as legacy mirrors (write-back on save, read on migration):** `backgroundUrl`, `iconUrl`.

**Added** — uniform `{cat}Source` / `{cat}Local` / `{cat}Web` triples:

```js
backgroundSource:  "local", backgroundLocal:  "Main/background.jpg",                         backgroundWeb:  "",
bannerSource:      "local", bannerLocal:      "",                                            bannerWeb:      "",
crestSource:       "local", crestLocal:       "",                                            crestWeb:       "",
profileIconSource: "local", profileIconLocal: "",                                            profileIconWeb: "",
loadingBgSource:   "local", loadingBgLocal:   "Loading Screen/loading-background.jpg",       loadingBgWeb:   "",
loadingIconSource: "local", loadingIconLocal: "Loading Screen/loading-icon.gif",             loadingIconWeb: "",
```

### 4.2 Migration

Runs once at `initSettingsPage` start, before merge with DEFAULTS. Idempotent.

```
if saved.iconAllPlayers !== undefined: delete it
if saved.backgroundUrl && saved.backgroundSource === undefined:
    if saved.backgroundUrl starts with "//plugins/KysoTheme/assets/":
        saved.backgroundSource = "local"
        saved.backgroundLocal  = path after "//plugins/KysoTheme/assets/"
    else:
        saved.backgroundSource = "web"
        saved.backgroundWeb    = saved.backgroundUrl
if saved.iconUrl && saved.profileIconSource === undefined:
    similar split for profileIcon
```

### 4.3 Runtime resolution

```js
function resolveAsset(cat, settings) {
  return settings[cat + "Source"] === "web"
    ? settings[cat + "Web"]
    : pluginAsset(settings[cat + "Local"]);
}
```

### 4.4 Save flow

When user saves, `settingsPage.js` writes new fields and also writes back legacy mirrors `backgroundUrl` / `iconUrl` derived from the resolved values, so any external consumer of those keys keeps working. The legacy mirrors are **write-only from KysoTheme's perspective** — once migration runs, no internal code reads them; resolution always goes through the new triples via `resolveAsset()`.

If `saved.backgroundUrl === ""` (empty) at migration time, neither migration branch fires; DEFAULTS supply `backgroundSource: "local"` + `backgroundLocal: "Main/background.jpg"` on merge. Same idea for `iconUrl`.

---

## 5. DOM targets and apply functions

Every `apply*` function is idempotent. Each installs a persistent `MutationObserver` on `document.body` that re-invokes itself when the relevant target node appears (boot timing and page navigation can destroy shadow roots).

### 5.1 `applyProfileIcon(url)` — self-only

**Targets:**

- **A** — Profile page: `lol-regalia-profile-v2-element` (shadow) → `lol-regalia-crest-v2-element` → `setAttribute('profile-icon-url', url)`
- **B** — Sidebar avatar: `lol-social-avatar .summoner-level-icon .icon-image` → `setAttribute('src', url)`

Migrates from `index.js:changeIcon()` (which is deleted). The existing global CSS path (`iconBlock` at `settingsPage.js:1219-1233` that targeted `.icon-image.has-icon` etc.) is removed entirely.

If `url === ""`, skip both mutations (Riot default takes over).

### 5.2 `applyBanner(url)` — shadow-root style injection

**Target:** `lol-regalia-profile-v2-element` (shadow) → `lol-regalia-banner-v2-element` (shadow)

Inject `<style id="kyso-banner-override">` into the banner element's shadowRoot:

```css
.banner { background-image: url("URL") !important; }
```

If `url === ""`, set `style.textContent = ""` (banner falls back to Riot default).

### 5.3 `applyCrest(url)` — shadow-root style injection

**Target:** `lol-regalia-profile-v2-element` (shadow) → `lol-regalia-crest-v2-element` (shadow)

Inject `<style id="kyso-crest-override">`:

```css
.crest { background-image: url("URL") !important; }
```

Empty-URL behavior identical to banner.

### 5.4 `applyLoadingScreen({ bgUrl, iconUrl })` — document-level style

Inject / replace `<style id="kyso-loading-style">` in `document.head`:

```css
.lol-loading-screen-container.lol-loading-screen-default-state {
  background: url("BG_URL") #000000 center/cover no-repeat !important;
}
.lol-loading-screen-lol-icon {
  background-image: url("ICON_URL") !important;
}
```

If `bgUrl === ""`, the first rule is omitted. If `iconUrl === ""`, the second rule is omitted. If both empty, the `<style>` element is removed.

No MutationObserver needed — loading screen renders in the main document, CSS specificity is sufficient. The hardcoded rules at `theme.css:432-460` are removed so this style is the sole authority.

### 5.5 `applyBackground` — unchanged

Existing `applyBackground(url, type)` in `settingsPage.js` keeps its current `#kyso-global-bg` implementation. It now receives `resolveAsset("background", settings)` instead of `settings.backgroundUrl`.

### 5.6 Wiring in `applyAllSettings`

```js
const m = { ...DEFAULTS, ...settings };
applyBackground(resolveAsset("background", m), m.backgroundType);
applyBanner(resolveAsset("banner", m));
applyCrest(resolveAsset("crest", m));
applyProfileIcon(resolveAsset("profileIcon", m));
applyLoadingScreen({
  bgUrl:   resolveAsset("loadingBg", m),
  iconUrl: resolveAsset("loadingIcon", m),
});
```

---

## 6. Manifest format

```json
{
  "version": 1,
  "categories": {
    "backgrounds": [
      { "label": "Default Static",   "path": "Main/background.jpg" },
      { "label": "Default Animated", "path": "Main/background.gif" }
    ],
    "banners":            [],
    "crests":             [],
    "profileIcons":       [],
    "loadingBackgrounds": [{ "label": "Default", "path": "Loading Screen/loading-background.jpg" }],
    "loadingIcons":       [{ "label": "Default", "path": "Loading Screen/loading-icon.gif" }]
  }
}
```

**Initial population:** seeded with the files currently in `assets/`. Existing backgrounds (`Main/background.jpg`, `Main/background.gif`, `Collections/collections-bg22.jpg`, `Runes and Select/champ-select-and-runes.jpg`, etc.) all listed under `backgrounds`. Loading defaults listed under their categories. `banners`, `crests`, `profileIcons` start empty — user populates by dropping files and editing manifest.

**Add-new workflow:**

1. Drop file into `assets/<Category>/foo.png`
2. Add `{ "label": "Foo", "path": "Category/foo.png" }` to manifest
3. Reload client

`loadManifest()` is called once at boot; result is cached. Result must be re-fetched on client reload, not via live watch.

---

## 7. Settings UI

A new section **"Player Assets"** sits above the existing Color Theme section. The existing Background section is refactored into this new section so all 6 categories share one consistent block layout.

### 7.1 Per-category block layout

```
┌─ <Category Label> ───────────────────────────┐
│  Source:  ( • ) Local   ( ) Web              │
│  [▾ <dropdown of manifest entries>       ]   │  ← visible if Local
│  [https://...                  ] [Apply]     │  ← visible if Web
│  [thumbnail preview 60x60 if URL set]        │
│  [Reset to default]                          │
└──────────────────────────────────────────────┘
```

Source switch is a segmented control (radio buttons styled). Toggling it shows/hides the matching input.

**Apply behavior per mode:**
- **Local mode** — changing the `<select>` value immediately saves + re-applies (no explicit Apply button click needed). Matches existing background dropdown UX where it exists in current code.
- **Web mode** — user types URL into the input; explicit **Apply** button click saves + re-applies. (Avoids re-applying on every keystroke.)

**Reset** clears `{cat}Web` and sets `{cat}Local` back to the DEFAULTS value (which for backgrounds and loading screen is the original built-in asset; for banner/crest/profileIcon, an empty `""` that disables the override).

### 7.2 Background-specific extras

The existing top-level "Background" section is **removed**. Its block becomes one of the 6 blocks under the new "Player Assets" section, sharing the same layout. The background block keeps its existing `backgroundType` dropdown (auto / image / gif / video) as an extra row below the source switch — orthogonal to source.

### 7.3 i18n keys (per locale, 6 locales: en, pt, es, de, ja, ko)

```
assetsSection          "Player Assets"
bannerLabel            "Banner"
crestLabel             "Crest"
profileIconLabel       "Profile Icon"
loadingBgLabel         "Loading Background"
loadingIconLabel       "Loading Icon"
sourceLocal            "Local"
sourceWeb              "Web"
selectPlaceholder      "Choose..."
noLocalAssets          "No local assets in manifest"
resetToDefault         "Reset to default"
```

`bgSection` / `bgUrl` / `bgApply` / `bgRemove` existing keys are reused for the refactored background block.

---

## 8. Error handling

| Failure | Behavior |
|---|---|
| `manifest.json` 404 or parse error | `loadManifest()` resolves to `{ version: 1, categories: { backgrounds: [], banners: [], ... } }`. UI dropdowns show "noLocalAssets" placeholder. Web mode still works. Console warning. |
| `pluginAsset("")` | Returns `""`. Treated by apply functions as "clear override". |
| `apply*("")` | Banner / crest: `style.textContent = ""`. Profile icon: skip mutation. Loading screen: omit corresponding rule (or remove `<style>` if both empty). |
| Manifest entry points to missing file | Browser fails to load image silently. No interception — debugging is the user's responsibility. |
| Shadow root absent at apply time | MutationObserver re-runs apply when target appears. Apply is idempotent. |
| Migration runs twice | Idempotent — `{cat}Source === undefined` gate prevents double-migration. |

---

## 9. Testing checklist (manual)

1. **Boot fresh** — defaults apply; loading screen looks identical to current behavior (visual no-op for default values).
2. **Background, Local** — pick a different entry from dropdown → `#kyso-global-bg` updates.
3. **Background, Web** — paste a URL → updates.
4. **Banner, Local** — drop a file into `assets/Banners/foo.png`, add manifest entry, reload, open profile page → banner replaced.
5. **Crest, Local** — same flow → crest replaced on profile page.
6. **Profile icon, Local** — pick an icon → profile page icon + sidebar avatar update. **Open a lobby with other players — their icons must be unaffected.**
7. **Loading background + icon** — change both → start a game → loading screen reflects new assets.
8. **Migration from existing settings** — set `backgroundUrl` to `"//plugins/KysoTheme/assets/Main/background.gif"` in DataStore, clear new keys, reload → `backgroundSource === "local"`, `backgroundLocal === "Main/background.gif"`.
9. **Migration with web URL** — set `backgroundUrl` to `"https://example.com/x.jpg"`, reload → `backgroundSource === "web"`, `backgroundWeb` matches.
10. **`iconAllPlayers` removal** — pre-existing `iconAllPlayers === true` value is dropped silently; no global CSS injection happens; other players' icons are untouched.
11. `node --check assetReplacers.js settingsPage.js index.js` → OK.
12. **Reset buttons** — each category's reset returns to DEFAULTS values.

---

## 10. Open items deferred to PR B / PR C

- **Color picker** — current `_hexToFilter` uses `sepia + hue-rotate + saturate + brightness`, distorts mid-tones. Replace with direct CSS-var-driven approach in PR B.
- **RGB animations** — fade L→R, blink, spiral, applied to accent or specific elements. PR C.
- **Manifest auto-generator** — future quality-of-life script.

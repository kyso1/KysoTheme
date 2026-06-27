# Regalia Hovercard Override — Implementation Plan

> **For agentic workers:** execute task-by-task. Each task ends with `node --check` on every touched file + a grep for top-level name collisions (Pengu rewrites `function` decls to `const`; a duplicate top-level name passes `node --check` but breaks the whole plugin at load).

**Goal:** Override the regalia hovercard popup (crest tier, summoner icon, mastery=LP) for the local player only, plus a new self-only backdrop splash asset with crop.

**Spec:** `docs/superpowers/specs/2026-06-27-regalia-hovercard-override-design.md`

## Global Constraints

- Self-only: hovercard overrides apply only where `lol-regalia-hovercard-v2-element[summoner-id] == _selfSummonerId` (from `/lol-summoner/v1/current-summoner`).
- No new toggles for crest/icon/mastery — they ride existing fields (`crestRank`, `iconUrl`, `crestLP`). Backdrop is opt-in (empty = client default).
- Backdrop crop: aspect **2.934:1**, output **804×274** PNG dataURL.
- After EVERY task: `node --check index.js && node --check assetReplacers.js && node --check settingsPage.js`, and grep each touched file for any new top-level identifier to confirm no duplicate declaration.

---

### Task 1: attachShadow open-patch + self summoner-id

**Files:** Modify `index.js` (top), `assetReplacers.js` (self-id cache).

- [ ] **index.js** — add at module top level, immediately after the imports block (before `_debounce`), so it runs on import before the client builds hovercards:

```js
// Force every shadow root open so the plugin can read/override closed
// component internals (regalia hovercard crest/icon/backdrop live in a closed
// shadow root). Benign: only makes roots readable; no behavior change.
if (!Element.prototype.__kysoOpenShadow) {
  Element.prototype.__kysoOpenShadow = Element.prototype.attachShadow;
  Element.prototype.attachShadow = function (init) {
    return this.__kysoOpenShadow({ ...(init || {}), mode: "open" });
  };
}
```

- [ ] **assetReplacers.js** — add near the other module state (after `_findAllDeep`):

```js
// Local player's summonerId — hovercard overrides are self-only. Resolved once
// from the LCU; until it arrives, hovercard overrides no-op, then re-apply.
let _selfSummonerId = "";
let _selfIdPromise = null;
function ensureSelfSummonerId(onResolved) {
  if (_selfSummonerId) { if (onResolved) onResolved(_selfSummonerId); return; }
  if (!_selfIdPromise) {
    _selfIdPromise = fetch("/lol-summoner/v1/current-summoner")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("HTTP " + r.status))))
      .then((d) => { _selfSummonerId = String(d.summonerId || ""); return _selfSummonerId; })
      .catch((e) => { console.warn("[KysoTheme] self summonerId fetch failed:", e); _selfIdPromise = null; return ""; });
  }
  _selfIdPromise.then((id) => { if (id && onResolved) onResolved(id); });
}
```

- [ ] **Verify:** `node --check` all three. Grep `index.js` for `__kysoOpenShadow` (one definition). Reload client; theme still loads, profile still renders.

---

### Task 2: `applyHovercard` (icon + mastery=LP + backdrop), self-scoped

**Files:** Modify `assetReplacers.js`.

**Interfaces produced:** `export function applyHovercard({ iconUrl, lp, backdropUrl })`.

- [ ] Add after `applyCrestRank` (reuse `_crestDebounce`, `_findAllDeep`):

```js
let _hoverObserver = null;
let _hoverIcon = "";
let _hoverLp = "";
let _hoverBackdrop = "";
const _HOVER_GRADIENT =
  "linear-gradient(to top, #1A1C21 13.41%, rgba(196, 196, 196, 0) 75.55%)";

// Find the shadow root / document fragment that holds the hovercard popup
// siblings (#hover-card-backdrop, .hover-card-mastery-score) for a given self
// regalia element, by climbing host boundaries.
function _hovercardPopupRoot(regaliaEl) {
  let node = regaliaEl;
  for (let i = 0; i < 12 && node; i++) {
    const root = node.getRootNode ? node.getRootNode() : null;
    if (root && root.querySelector && root.querySelector("#hover-card-backdrop")) return root;
    node = root && root.host ? root.host : null;
  }
  return null;
}

function _updateHovercardDom() {
  if (!_hoverIcon && _hoverLp === "" && !_hoverBackdrop) return;
  if (!_selfSummonerId) return; // not resolved yet
  const cards = _findAllDeep("lol-regalia-hovercard-v2-element");
  for (const card of cards) {
    if (String(card.getAttribute("summoner-id") || "") !== _selfSummonerId) continue;
    // Summoner icon (inside the crest shadow under the regalia element)
    if (_hoverIcon && card.shadowRoot) {
      _findAllDeep(".lol-regalia-summoner-icon", card.shadowRoot).forEach((ic) => {
        const next = `url("${_hoverIcon}")`;
        if (ic.style.backgroundImage !== next) {
          ic.style.backgroundImage = next;
          ic.style.backgroundSize = "cover";
          ic.style.backgroundPosition = "center";
        }
      });
    }
    const root = _hovercardPopupRoot(card);
    if (!root) continue;
    if (_hoverLp !== "") {
      const ms = root.querySelector(".hover-card-mastery-score");
      if (ms && ms.textContent !== String(_hoverLp)) ms.textContent = String(_hoverLp);
    }
    if (_hoverBackdrop) {
      const bd = root.querySelector("#hover-card-backdrop");
      if (bd) {
        const next = `${_HOVER_GRADIENT}, url("${_hoverBackdrop}")`;
        if (bd.style.backgroundImage !== next) {
          bd.style.backgroundImage = next;
          bd.style.backgroundSize = "cover";
          bd.style.backgroundPosition = "center";
        }
      }
    }
  }
}

export function applyHovercard({ iconUrl, lp, backdropUrl } = {}) {
  _hoverIcon = iconUrl || "";
  _hoverLp = lp == null ? "" : String(lp).trim();
  _hoverBackdrop = backdropUrl || "";
  if (_hoverObserver) { _hoverObserver.disconnect(); _hoverObserver = null; }
  const active = _hoverIcon || _hoverLp !== "" || _hoverBackdrop;
  if (!active) return;
  ensureSelfSummonerId(() => _updateHovercardDom());
  _updateHovercardDom();
  _hoverObserver = new MutationObserver(_crestDebounce(_updateHovercardDom, 120));
  _hoverObserver.observe(document.body, { childList: true, subtree: true });
}
```

- [ ] **Verify:** `node --check assetReplacers.js`. Grep for `applyHovercard`, `_updateHovercardDom`, `_hovercardPopupRoot`, `ensureSelfSummonerId` — each declared once.

---

### Task 3: Self-guard the crest-tier override for hovercards

**Files:** Modify `assetReplacers.js` (`_updateCrestRankDom`).

The existing `_findAllDeep("lol-regalia-crest-v2-element").forEach((el) => setAttrs(el, tier));` would, with shadows now open, also hit other players' hovercard crests. Guard it.

- [ ] Add a helper near `_updateCrestRankDom`:

```js
// A crest-v2 inside a regalia hovercard is overridden only for the local
// player; crests elsewhere (profile page, sidebar) are unaffected.
function _crestAllowed(el) {
  const card = el.closest ? el.closest("lol-regalia-hovercard-v2-element") : null;
  if (!card) {
    // closest() doesn't cross shadow boundaries — climb hosts to check.
    let n = el;
    for (let i = 0; i < 12 && n; i++) {
      if (n.tagName === "LOL-REGALIA-HOVERCARD-V2-ELEMENT") {
        return String(n.getAttribute("summoner-id") || "") === _selfSummonerId;
      }
      const r = n.getRootNode ? n.getRootNode() : null;
      n = r && r.host ? r.host : (n.parentElement || null);
    }
    return true; // not in a hovercard
  }
  return String(card.getAttribute("summoner-id") || "") === _selfSummonerId;
}
```

- [ ] Change the crest-v2 loop in `_updateCrestRankDom` (the `if (tier) { _findAllDeep("lol-regalia-crest-v2-element")... }` block) to:

```js
    _findAllDeep("lol-regalia-crest-v2-element").forEach((el) => {
      if (!_crestAllowed(el)) return;
      setAttrs(el, tier);
    });
```

- [ ] In `applyCrestRank`, ensure self-id is requested so the guard resolves: after `_updateCrestRankDom();` add `ensureSelfSummonerId(() => _updateCrestRankDom());`
- [ ] **Verify:** `node --check assetReplacers.js`. Grep `_crestAllowed` (one decl).

---

### Task 4: Backdrop crop modal

**Files:** Modify `settingsPage.js` (after `openBannerCropModal`).

- [ ] Add constants near `BANNER_CROP_W`:

```js
// Hovercard backdrop ≈ 402×137 (ratio 2.934). Output 804×274.
const HOVER_BD_RATIO = 2.934;
const HOVER_BD_W = 804;
const HOVER_BD_H = 274;
```

- [ ] Add `function openHovercardBackdropCropModal(srcUrl, onConfirm)` — a copy of `openBannerCropModal` with: title/hint via `t("hoverBackdropCropTitle")`/`t("hoverBackdropCropHint")`; every `/ 4` → `/ HOVER_BD_RATIO`, every `* 4` → `* HOVER_BD_RATIO`; `ch = Math.round(cw / HOVER_BD_RATIO)`; canvas `HOVER_BD_W × HOVER_BD_H`; keep the `kyso-crop-stage--wide` class. (Full body mirrors lines 2599-2743; only those substitutions differ.)
- [ ] **Verify:** `node --check settingsPage.js`. Grep `openHovercardBackdropCropModal`, `HOVER_BD_W` (one decl each — and confirm `openIconCropModal`/`openBannerCropModal` still single).

---

### Task 5: DEFAULTS + i18n + Assets-panel backdrop section + wiring

**Files:** Modify `settingsPage.js`.

- [ ] **DEFAULTS** (after `crestLP`): `hoverBackdrop: "",` // self-only hovercard splash (dataURL/web URL); "" = client default
- [ ] **i18n** — add to each lang block (mirror `cropButton`/`bannerCropTitle` style). EN:
  - `hoverBackdropLabel: "Hovercard backdrop"`
  - `hoverBackdropHint: "Self-only splash behind your regalia hover card. Cropped to 2.934:1."`
  - `hoverBackdropCropButton: "Crop backdrop"`
  - `hoverBackdropCropTitle: "Crop hovercard backdrop (2.93:1)"`
  - `hoverBackdropCropHint: "Drag the frame to choose the visible area."`
  - PT-BR: `hoverBackdropLabel: "Fundo do hovercard"`, `hoverBackdropHint: "Splash atrás do seu hover card de regalia (só você). Cortado em 2.934:1."`, `hoverBackdropCropButton: "Cortar fundo"`, `hoverBackdropCropTitle: "Cortar fundo do hovercard (2.93:1)"`, `hoverBackdropCropHint: "Arraste o quadro para escolher a área visível."`
  - Other langs (es/de/ja/ko): reuse the EN strings (acceptable; other asset hints already partially English).
- [ ] **Assets panel** — add a section after the Profile Icon section (`#kyso-icon-section`, ~line 3394), mirroring it minus the all-players toggle:

```html
    <section class="kyso-settings-section" id="kyso-hoverbd-section">
      <h3 class="kyso-settings-section-title">${ICONS.picture}<span>${t("hoverBackdropLabel")}</span></h3>
      <div class="kyso-settings-row">
        <label class="kyso-label" for="kyso-hoverbd-url">${t("iconUrl")}</label>
        <input id="kyso-hoverbd-url" class="kyso-input" type="text"
          placeholder="${t("iconUrlPlaceholder")}"
          value="${(settings.hoverBackdrop || "").replace(/"/g, "&quot;")}">
      </div>
      <div class="kyso-settings-row kyso-settings-row--upload">
        <label class="kyso-label">${t("iconUpload")}</label>
        <label class="kyso-btn kyso-btn--secondary kyso-upload-label">
          ${ICONS.folder}<span>${t("iconChoose")}</span>
          <input id="kyso-hoverbd-file" type="file" accept="image/*" style="display:none;">
        </label>
        <span id="kyso-hoverbd-filename" class="kyso-filename">${t("noFile")}</span>
      </div>
      <div class="kyso-settings-row"><span class="kyso-hint">${t("hoverBackdropHint")}</span></div>
      <div class="kyso-settings-row">
        <button id="kyso-hoverbd-crop" class="kyso-btn kyso-btn--secondary" ${settings.hoverBackdrop ? "" : "disabled"}>${ICONS.scissors}<span>${t("hoverBackdropCropButton")}</span></button>
        <button id="kyso-hoverbd-apply" class="kyso-btn kyso-btn--primary">${t("iconApply")}</button>
        <button id="kyso-hoverbd-reset" class="kyso-btn kyso-btn--danger">${t("iconRemove")}</button>
      </div>
    </section>
```

- [ ] **Binding** — add after the Profile Icon handlers (~line 3709), mirroring them (single `hoverBackdrop` string; crop saves dataURL; apply/reset call `applyAllSettings`):

```js
  // Hovercard backdrop handlers
  const hbdUrlInput  = panel.querySelector("#kyso-hoverbd-url");
  const hbdFileInput = panel.querySelector("#kyso-hoverbd-file");
  const hbdFilename  = panel.querySelector("#kyso-hoverbd-filename");
  const hbdCropBtn   = panel.querySelector("#kyso-hoverbd-crop");
  const hbdApplyBtn  = panel.querySelector("#kyso-hoverbd-apply");
  const hbdResetBtn  = panel.querySelector("#kyso-hoverbd-reset");
  let _hbdPendingUrl = "";
  const _enableHbdCrop = () => { hbdCropBtn.disabled = !(hbdUrlInput.value.trim() || _hbdPendingUrl); };
  const _saveHbd = (url) => {
    const s = { ...DEFAULTS, ...loadSettings(), hoverBackdrop: url };
    saveSettings(s);
    assetReplacers.applyHovercard({ iconUrl: s.iconUrl || "", lp: s.crestLP || "", backdropUrl: url });
  };
  if (hbdUrlInput) hbdUrlInput.addEventListener("input", _enableHbdCrop);
  if (hbdFileInput) hbdFileInput.addEventListener("change", () => {
    const file = hbdFileInput.files[0];
    if (!file) return;
    hbdFilename.textContent = file.name;
    const reader = new FileReader();
    reader.onload = (ev) => { _hbdPendingUrl = ev.target.result; hbdUrlInput.value = ""; _enableHbdCrop(); };
    reader.readAsDataURL(file);
  });
  if (hbdCropBtn) hbdCropBtn.addEventListener("click", () => {
    const src = _hbdPendingUrl || hbdUrlInput.value.trim();
    if (!src) return;
    openHovercardBackdropCropModal(src, (dataUrl) => {
      _hbdPendingUrl = "";
      hbdFilename.textContent = t("noFile");
      hbdUrlInput.value = dataUrl;
      _enableHbdCrop();
      _saveHbd(dataUrl);
      showFeedback(panel, t("iconApplied"));
    });
  });
  if (hbdApplyBtn) hbdApplyBtn.addEventListener("click", () => {
    _saveHbd(hbdUrlInput.value.trim());
    showFeedback(panel, t("iconApplied"));
  });
  if (hbdResetBtn) hbdResetBtn.addEventListener("click", () => {
    hbdUrlInput.value = ""; _hbdPendingUrl = ""; hbdFilename.textContent = t("noFile");
    hbdCropBtn.disabled = true;
    _saveHbd("");
    showFeedback(panel, t("iconRemoved"));
  });
```

- [ ] **applyAllSettings** — after the `applyCrestRank(...)` line, add:

```js
  assetReplacers.applyHovercard({ iconUrl: merged.iconUrl || "", lp: merged.crestLP || "", backdropUrl: merged.hoverBackdrop || "" });
```

- [ ] **Verify:** `node --check settingsPage.js`. Grep new ids/vars (`kyso-hoverbd`, `_hbdPendingUrl`, `_saveHbd`, `hoverBackdrop`) for single declaration. Reload; open Settings → Player Assets → Hovercard backdrop appears; pick image → crop → applies. Hover own regalia → backdrop/icon/mastery/crest reflect overrides; hover another player → unaffected.

---

## Self-Review notes

- Single `hoverBackdrop` string mirrors the icon picker (dataURL/web) — no source/local/web triple, no manifest preset list needed (drop the `hoverBackdrops` manifest category from the spec; picker is upload/URL only).
- Crest tier reuses `applyCrestRank`; only the self-guard is new. Wings/plate/division bg fallback deferred until live verification shows the attribute re-render is insufficient.
- All overrides ride existing controls; backdrop is opt-in. Project rule satisfied.

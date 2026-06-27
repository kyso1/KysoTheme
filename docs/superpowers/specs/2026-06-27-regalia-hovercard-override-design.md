# Regalia Hovercard Override — Design Spec

**Date:** 2026-06-27
**Branch target:** continues the KysoTheme UI customization work (post v3.2)
**Status:** Approved pending user review

## Goal

Extend KysoTheme's existing rank/icon overrides into the **regalia hovercard
popup** (the floating card shown when hovering a player's regalia on the
profile page), and add a new **self-only backdrop splash** asset with crop.

## Background / Discovery

The hovercard's visible content lives inside the **closed** shadow root of
`lol-regalia-hovercard-v2-element` (and a sibling popup host). The plugin's
`_findAllDeep` walks shadow roots via `node.shadowRoot`, which is `null` for
closed roots — so none of these nodes are reachable today.

Captured structure of the hovercard popup (self, summoner-id `32294445`):

```
#hover-card-backdrop        → inline background-image: gradient + champ splash (402×137, ratio 2.934)
.hover-card-rank            → .hover-card-rank-img-container (rank shown as CSS bg image)
.hover-card-challenge-crystal
.hover-card-mastery-score   → "794" (plain text)
.hover-card-title           → (absent this capture)
lol-regalia-hovercard-v2-element.regalia-loaded[summoner-id]
  └ lol-regalia-crest-v2-element[ranked-tier="EMERALD"]   ← the ranked crest
      ├ .lol-regalia-summoner-icon   (bg = /lol-game-data/.../profile-icons/5915.jpg = GAME icon)
      ├ .lol-regalia-ranked-border-container (bg wings_emerald_plate.png)
      ├ .lol-regalia-rank-division-container (bg emerald-plate.png) → .lol-regalia-rank-division-text "I"
      └ .level-text "708"
```

## Architecture

### 1. Force shadow roots open (load-time patch)

In `index.js`, at module top level (runs on import, before the client builds
hovercards), patch `Element.prototype.attachShadow` to force `mode:"open"`:

```js
if (!Element.prototype.__kysoOpenShadow) {
  Element.prototype.__kysoOpenShadow = Element.prototype.attachShadow;
  Element.prototype.attachShadow = function (init) {
    return this.__kysoOpenShadow({ ...(init || {}), mode: "open" });
  };
}
```

- Idempotent guard prevents double-patch.
- Benign: only makes shadow roots *readable*; no visual or behavioral change.
- Hovercards are built on hover (after load) → their roots will be open.
- **Risk + fallback:** broad force-open is the standard technique and is
  reliable. If any component misbehaves, scope the patch to force-open only
  when `this.tagName` matches the regalia/hovercard host tags, leaving all
  other roots closed.

### 2. Resolve self summoner-id

Fetch once at load (with retry): `fetch("/lol-summoner/v1/current-summoner")`
→ JSON `summonerId`. Cache as `_selfSummonerId` (string). The hovercard host
carries `summoner-id="…"`; overrides apply only when it equals
`_selfSummonerId`. Until resolved, hovercard overrides are skipped (no-op),
then re-applied once the id arrives.

### 3. `applyHovercard(opts)` — new in assetReplacers.js

New exported function + debounced observer (mirrors `applyCrestRank`). For each
**self** hovercard popup (located via the self regalia element, climbing to the
popup root that also contains `#hover-card-backdrop`/`.hover-card-mastery-score`):

- **Summoner icon** — if `iconUrl` set: `.lol-regalia-summoner-icon`
  `style.backgroundImage = url(iconUrl)` (cover/center). Reuses the already-
  selected `iconUrl` (the captured path is the game icon; this forces custom).
- **Mastery = LP** — if `lp` set: `.hover-card-mastery-score` textContent = `lp`.
  Reuses the existing `crestLP` field.
- **Backdrop** — if `backdropUrl` set: `#hover-card-backdrop`
  `style.backgroundImage = linear-gradient(to top,#1A1C21 13.41%,rgba(196,196,196,0) 75.55%), url("backdropUrl")`,
  `background-size: cover`, `background-position: center`. Empty = client default.

Observer stays connected while any of icon/lp/backdrop is active (cards mount on
hover, after first apply). Debounced ~120ms; disconnect-during-write pattern.

### 4. Crest tier in hovercard (extends `_updateCrestRankDom`)

The existing `applyCrestRank` already sets `ranked-tier`/`ranked-division` on
every `lol-regalia-crest-v2-element` via `_findAllDeep`. Once shadows are open
it would reach the hovercard crest **and every other player's hovercard crest** —
violating self-only. Fix: in `_updateCrestRankDom`, when applying to a crest-v2
that is **inside a `lol-regalia-hovercard-v2-element`**, apply only if that
host's `summoner-id == _selfSummonerId`. Crests NOT inside a hovercard (profile
page, sidebar) keep current behavior unchanged.

- Setting `ranked-tier`/`ranked-division` re-renders wings/plate/division from
  the crest-v2 component (same component the profile override already drives).
- **Fallback** (only if the client doesn't re-render the bg images): set
  `.lol-regalia-ranked-border-container` and `.lol-regalia-rank-division-container`
  background-images to `wings_<tier>_plate.png` / `<tier>-plate.png`, and
  `.lol-regalia-rank-division-text` text to the division. Implement the attribute
  path first; add the fallback only if verification shows it's needed.

No new user control — rides the existing rank selector.

### 5. Backdrop asset + crop (Assets panel)

New "Hovercard backdrop" picker in Player Assets, mirroring the existing icon
picker: source toggle (local/web), file input + URL input, **crop button**,
preview, clear. Crop uses a new modal `openHovercardBackdropCropModal` modeled
on `openBannerCropModal` but at the backdrop ratio:

- Aspect **2.934:1**; output PNG dataURL **804×274** (`HOVER_BACKDROP_W=804`,
  `HOVER_BACKDROP_H=274`). Resize handles keep the 2.934 ratio.
- Crop result (dataURL) stored exactly as the icon picker stores its cropped
  result. Empty = no override.

i18n keys: `hoverBackdropLabel`, `hoverBackdropCropButton`,
`hoverBackdropCropTitle`, `hoverBackdropCropHint` (+ existing langs).

### 6. Settings + wiring

- DEFAULTS: add `hoverBackdrop*` keys mirroring the icon picker's keys
  (source/local/web or cropped-data, matched to the icon picker's exact scheme).
- `applyAllSettings`: resolve `backdropUrl` and call
  `assetReplacers.applyHovercard({ iconUrl: merged.iconUrl, lp: merged.crestLP, backdropUrl })`.
  Crest tier continues via the existing `applyCrestRank(...)` call (now self-
  guarded for hovercards).
- Ensure `_selfSummonerId` resolution kicks off at init.

## Project rule compliance (toggle OR first-run prompt)

- **Backdrop** — opt-in: empty image = client default.
- **Icon-in-hovercard / mastery=LP / crest-tier** — ride existing opt-in fields
  (`iconUrl`, `crestLP`, `crestRank`); each is already a user control.
- **attachShadow patch** — not a user-facing behavior (no visual change), so no
  toggle needed.

## Out of scope

- Overriding other players' hovercards (explicitly self-only).
- `.hover-card-rank` / `.hover-card-challenge-crystal` image overrides (the rank
  crest is covered via the regalia crest; these are not requested).
- Animations / intro video changes.

## Files touched

- `index.js` — attachShadow open-patch; kick off self-id fetch.
- `assetReplacers.js` — `applyHovercard` + observer; self-id cache; self-guard in
  `_updateCrestRankDom`.
- `settingsPage.js` — DEFAULTS keys; Assets-panel backdrop section + binding;
  `openHovercardBackdropCropModal`; i18n; `applyAllSettings` wiring.
- `assets/manifest.json` — `hoverBackdrops` category (if picker lists presets).

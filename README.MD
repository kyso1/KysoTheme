<div align="center">

# Kyso UI Editor

![image](https://github.com/user-attachments/assets/b0932804-79ab-458e-b8cc-dc776ef4258a)

**A clean, minimal, and deeply customizable League of Legends client theme.**  
Built for [Pengu Loader](https://pengu.lol) — configure everything without touching a single file.

<br>

[![Version](https://img.shields.io/badge/version-3.4-blue?style=for-the-badge&logo=github)](https://github.com/kyso1/KysoTheme/releases)
[![Pengu Loader](https://img.shields.io/badge/Pengu%20Loader-0.5.0%2B-purple?style=for-the-badge)](https://pengu.lol)
[![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)](LICENSE)

</div>

---

## ✨ Overview

KysoTheme transforms the League of Legends client into a cleaner, more personal experience. The **v3.x line** ships a fully-featured **native settings panel** plus a dedicated **UI Editor** and **Player Assets** tab — backgrounds, colors, fonts, icons, layout tweaks, granular show/hide controls, and rank/regalia overrides, all in one place. Every behavior is a toggle or a control; nothing is hardcoded.

> **No file editing. No restarts. Just open Settings → KysoTheme.**

---

## 🆕 What's New in v3.4

The v3.x releases turned every fixed theme behavior into a user control and added two new tabs.

### v3.4 — Custom icon in lobby & party
- Your selected **custom profile icon** now also shows on your **lobby player slot** and the **party banner** — matched to you only (by puuid / local marker), so teammates' icons are never touched.

### v3.1 — Kyso UI Editor
- Renamed to **Kyso UI Editor** with a **first-run welcome modal**.
- Turned previously hardcoded behaviors into switches: themed/vanilla **play button**, **banner**, **gear & LoR buttons**, **profile background transparency**, a **social blur slider**, and **profile-icon placement / navbar sync**.

### v3.2 — UI Editor tab + Player Assets expansion
- **UI Editor tab** with a **live search bar** that filters controls by label.
- **Granular show/hide toggles** (each previously hover-faded element is now its own switch): chat, invite, notifications, XP ring, status, social actions, patch version, XP radial, rune recommender, deep links, loot backdrop, incident ticker, restriction warning, loading spinner, lobby overlay, **navbar dividers**, activity divider.
- **Visual-effect toggles** — client blur kill, store hue overlay, ready-check animation, viewport glow.
- **Per-screen backgrounds** — independent images for Collections, Champ-select, Runes, and Mode-switcher (picker in Player Assets + on/off in the UI Editor).
- **Sliding-door ⇄ hover mutex** — the navbar/social door and its hover mode are now mutually exclusive automatically.
- Performance: debounced whole-document observers and a blur-scrubber freeze fix.

### Rank crest override
- Fake your displayed rank to any tier (**Iron → Challenger**) with a **division (I–IV)** selector — the client renders the matching emblem art.
- **Ranked tooltip override**: rewrites the per-queue tier text, with a **"change all queues"** toggle and an **LP override** field.

### v3.3 — Regalia hovercard override (self-only)
The floating regalia hover card on your profile now follows your chosen rank — **only on your own card** (matched by summoner id):
- Crest tier art (wings, plate, division), the **mini rank emblem**, and the **"Tier (Queue)" text** all match the chosen rank.
- **Summoner icon** uses your selected custom icon.
- **Mastery score** mirrors your **LP** value (also on the profile emblem header).
- New **Hovercard backdrop** asset — pick a splash image with an interactive crop tool.

---

## 📋 Requirements

| Requirement                       | Version           |
| --------------------------------- | ----------------- |
| [Pengu Loader](https://pengu.lol) | 0.5.0 or above    |
| League of Legends                 | Any current patch |

---

## 📦 Installation

1. Download the latest release from the **[Releases](https://github.com/kyso1/KysoTheme/releases)** page.
2. Extract into your Pengu Loader plugins folder:

```
(Pengu root)/
└── plugins/
    └── KysoTheme/       ← extract here
        ├── assets/
        ├── main-theme/
        ├── utilsCss/
        ├── utilsImg/
        ├── index.js
        ├── settingsPage.js
        └── ...
```

3. Start (or restart) the League client — KysoTheme loads automatically.

> ⚠️ If the theme doesn't load, make sure Pengu Loader is enabled and the folder name is exactly `KysoTheme`.

---

## 🚀 Features

### ⚙️ Native Settings Page

A full settings panel injected directly into the League client's settings screen.  
No external apps, no config files.

**Open via:** `Settings (gear icon) → KysoTheme`

---

### 🎨 Player Assets

A unified panel that lives in its **own settings tab** (sibling to KysoTheme) — swap every visual asset the client renders for you — backgrounds, banners, crests, loading screens, profile icon — from one place. Each asset has a **Local / Web** toggle: pick from a **thumbnail grid** of files shipped with the theme, or paste any URL.

| Asset                  | What it does                                                                                         |
| ---------------------- | ---------------------------------------------------------------------------------------------------- |
| **Background**         | Full client background — images, animated GIFs, or videos (`.mp4` / `.webm`)                         |
| **Banner**             | Replaces your regalia banner on the profile page (shadow-DOM style injection, transparent overlay)   |
| **Crest**              | Replaces the frame around your profile icon, **or override your displayed rank** to any tier (Iron → Challenger) + division — emblem, tooltip tier text and LP all follow |
| **Loading screen**     | Custom loading-screen background **and** spinning icon, applied at game launch                       |
| **Profile icon**       | Custom icon for your profile page + sidebar; optional "Apply to all players" mode                    |
| **Hovercard backdrop** | Self-only splash behind your regalia hover card, with an interactive crop tool                       |

**Local / Web switch:**
- **Local** — thumbnail grid of every file declared in `assets/manifest.json`. Drop a new file into the right folder, add a one-line manifest entry, reload — it shows up as a clickable preview.
- **Web** — paste any URL. Useful for icons hosted on Discord, Imgur, etc.

**Manifest example** (`assets/manifest.json`):

```json
{
  "categories": {
    "crests": [
      { "label": "Diamond", "path": "//plugins/rcp-fe-lol-static-assets/global/default/images/ranked-emblems/emblem-diamond.png" },
      { "label": "My custom", "path": "Crests/custom.png" }
    ]
  }
}
```

Entries can point at a local file (relative path under `assets/`) **or** an absolute URL — including built-in LCU assets like the ranked emblems above.

**Media type override:** the Background block has an extra dropdown to force Image / GIF / Video parsing in case auto-detect picks wrong.

**Supported formats:** `.jpg` `.png` `.webp` `.gif` `.mp4` `.webm`

---

### 🎨 Accent Color

Recolor the entire theme's accent with a single hex value — borders, icons, highlights, and buttons all update instantly.

- 🎨 **Custom hex color** picker
- 🤖 **Auto-extract** — samples the dominant color from the current background automatically
- 🎛️ **Built-in presets** — one-click color options
- 🔄 **Reset to white** — restore the default look at any time

#### 🌫️ Visual Effects (CSS filters on background)

Live sliders inside the Color Theme panel let you tweak the background container in real time:

| Effect          | Range       |
| --------------- | ----------- |
| **Blur**        | 0 – 20 px   |
| **Brightness**  | 50 – 200 %  |
| **Saturation**  | 0 – 200 %   |
| **Contrast**    | 50 – 200 %  |

Each slider auto-saves; a single **Reset effects** button restores the defaults.

---

### 🔤 Font Customization

Replace the default League client font with anything you like.

- **Google Fonts** — paste an import URL (e.g. from [fonts.google.com](https://fonts.google.com))
- **Local font upload** — upload `.ttf`, `.otf`, or `.woff2` files from your PC
- **System fonts** — type the name of any font already installed on your machine
- **Remove** — restore the client's default font instantly

---

### 🪪 Profile Icon (with crop tool)

Set a fully custom profile icon — yours alone, or replicated across the entire client.

- **Remote URL** — link any image as your icon
- **Local upload** — upload directly from your PC
- **Built-in crop tool** — interactive 1:1 crop overlay so your icon is always framed perfectly
- **Apply to all players** — when **OFF**, only your profile page and the sidebar profile button get the custom icon (other players keep Riot defaults). When **ON**, the icon also replaces everyone else's via global CSS.

---

### 🎨 RGB Accent Animations

Beyond a static accent color, you can drive the entire theme through animated RGB modes — useful for streamers or anyone who wants a more lively look.

| Mode               | What it does                                                       |
| ------------------ | ------------------------------------------------------------------ |
| **Static**         | Fixed accent color                                                 |
| **Rainbow cycle**  | Smooth hue rotation across the full color wheel                    |
| **Fade L→R**       | Horizontal gradient sweep                                          |
| **Blink**          | Strobe between two colors                                          |
| **Spiral fade**    | Spiraling hue transition                                           |

All modes share a **speed slider** (throttled to ~20 fps for low CPU impact) and a hex picker so you can lock the base color.

---

### 👁️ Visibility Controls

Fine-tune exactly what shows up in the client UI:

| Toggle                         | What it does                                                  |
| ------------------------------ | ------------------------------------------------------------- |
| **Hide RP**                    | Removes the RP currency from the store bar                    |
| **Always show hover elements** | Keeps missions, chat, profile, and status permanently visible |
| **Hide TFT (hover mode)**      | Hides the TFT nav button unless you hover over it             |
| **Hide social panel only**     | Collapses the friend list on hover                            |
| **Hide social + right nav**    | Collapses both the friend list and right navigation bar       |

---

### 🚪 Sliding-Door Buttons

Two optional hidden-by-default tab buttons for a cleaner look:

- **Navbar hider** — a slim vertical tab on the left edge; click to slide the entire top navbar out of view
  - Optional: keep Blue Essence always visible even when the navbar is hidden
- **Social panel hider** — a slim vertical tab on the right edge; click to slide the social/friend panel offscreen

Both states are remembered between client sessions.

---

### 🌍 Multi-Language Support

The settings page is fully translated. Language is detected automatically from the League client locale.

<div align="center">

🇺🇸 English &nbsp;|&nbsp; 🇧🇷 Português &nbsp;|&nbsp; 🇪🇸 Español &nbsp;|&nbsp; 🇩🇪 Deutsch &nbsp;|&nbsp; 🇯🇵 日本語 &nbsp;|&nbsp; 🇰🇷 한국어

</div>

---

### 🔧 Under the Hood

| Feature                   | Description                                                                     |
| ------------------------- | ------------------------------------------------------------------------------- |
| **Profile Skin Unlocker** | Unlocks all skins on the profile page for display                               |
| **Auto Accept**           | Automatically accepts match-found popups                                        |
| **Blur Scrubber**         | Force-removes `backdrop-filter` blur from the sidebar, navbar, and social panel |
| **Persistent settings**   | Everything is saved via `DataStore` and restored on every client launch         |
| **Home button**           | Custom icon button injected into the Activity Center tabs                       |

---

## 📁 File Structure

```
KysoTheme/
├── assets/
│   ├── manifest.json       ← Declares every "Local" asset by category
│   ├── Main/               ← Backgrounds
│   ├── Loading Screen/     ← Loading-screen background + icon
│   ├── ModeSwitcher/
│   ├── Runes and Select/
│   ├── Collections/
│   └── Older/
├── main-theme/
│   └── theme.css           ← Core styles (layout, hover effects, fonts)
├── utilsCss/
│   ├── ThemeSettings.css
│   ├── AutoAccept.css
│   └── DodgeButton.css
├── utilsImg/               ← UI icons used by the theme
├── assetReplacers.js       ← Pure DOM-mutation module (banner / crest / icon / loading)
├── index.js                ← Entry point
├── settingsPage.js         ← Settings UI & all apply/persist logic
├── backgroundSelector.js
├── autoaccept.js
└── imgUtils.js
```

---

## 🖼️ Adding Custom Assets

Two ways to bring new assets into the theme.

**1. Via the Web URL field** (zero config) — just paste a URL into any asset's *Web* tab and hit Apply.

**2. Via the manifest** (so it shows up in the *Local* dropdown):

1. Drop your file into the right folder under `assets/` (e.g. `assets/Main/`, `assets/Crests/`, `assets/Loading Screen/`).
2. Open `assets/manifest.json` and add a one-line entry to the matching category:

```json
{ "label": "My background", "path": "Main/my-bg.jpg" }
```

3. Reload the client. The new entry shows up in the Local dropdown for that asset.

The manifest also accepts **absolute URLs** in `path` — handy for pointing at built-in LCU assets like the ranked emblems shipped under `//plugins/rcp-fe-lol-static-assets/...`.

> 💡 **Tip:** For best performance, use `.webm` for animated backgrounds. It's smaller than `.gif` and renders more smoothly.

---

## ❓ FAQ

**Q: The theme loaded but I don't see the settings tab.**  
A: Make sure Pengu Loader is up to date (0.5.0+). The settings tab injects on client load — try restarting the client.

**Q: My video background isn't showing.**  
A: Videos can't be stored as base64. Place the file inside `assets/Main/` and use the path `//plugins/KysoTheme/assets/Main/video.mp4` in the URL field.

**Q: The accent color looks off.**  
A: Try using "Auto-extract" first to get a color that matches your background, then fine-tune with the hex picker.

**Q: Can I use this alongside other Pengu Loader plugins?**  
A: Yes — KysoTheme is designed to coexist with other plugins without conflicts.

---

## 🤝 Contributing

Pull requests and issues are welcome!  
If you have a bug report, a feature idea, or want to add a translation, feel free to open an issue or PR on [GitHub](https://github.com/kyso1/KysoTheme).

---

<div align="center">

Made with ❤️ by **kyso1** &nbsp;·&nbsp; Built for [Pengu Loader](https://pengu.lol)

</div>

<div align="center">

# KysoTheme

![image](https://github.com/user-attachments/assets/b0932804-79ab-458e-b8cc-dc776ef4258a)

**A clean, minimal, and deeply customizable League of Legends client theme.**  
Built for [Pengu Loader](https://pengu.lol) — configure everything without touching a single file.

<br>

[![Version](https://img.shields.io/badge/version-3.0-blue?style=for-the-badge&logo=github)](https://github.com/kyso1/KysoTheme/releases)
[![Pengu Loader](https://img.shields.io/badge/Pengu%20Loader-0.5.0%2B-purple?style=for-the-badge)](https://pengu.lol)
[![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)](LICENSE)

</div>

---

## ✨ Overview

KysoTheme transforms the League of Legends client into a cleaner, more personal experience. Version 3.0 ships with a fully-featured **native settings panel** — backgrounds, colors, fonts, icons, and layout tweaks, all in one place.

> **No file editing. No restarts. Just open Settings → KysoTheme.**

---

## 📋 Requirements

| Requirement | Version |
|---|---|
| [Pengu Loader](https://pengu.lol) | 0.5.0 or above |
| League of Legends | Any current patch |

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

### 🖼️ Background System

> Supports images, animated GIFs, and videos as the client background.

| Feature | Details |
|---|---|
| **Preset selector** | Instantly switch between included backgrounds |
| **Custom URL** | Link to any image, GIF, or video — remote or local (`//plugins/KysoTheme/assets/...`) |
| **Local upload** | Upload a file directly from your PC. Files ≤ 2 MB are stored as base64; larger files use a path |
| **Video support** | Full `.mp4` / `.webm` video backgrounds |
| **Media type** | Auto-detect, or manually force Image / GIF / Video |
| **Open assets folder** | Quick-access button to browse local asset files |

**Supported formats:** `.jpg` `.png` `.webp` `.gif` `.mp4` `.webm`

---

### 🎨 Accent Color

Recolor the entire theme's accent with a single hex value — borders, icons, highlights, and buttons all update instantly.

- 🎨 **Custom hex color** picker
- 🤖 **Auto-extract** — samples the dominant color from the current background automatically
- 🎛️ **Built-in presets** — one-click color options
- 🔄 **Reset to white** — restore the default look at any time

---

### 🔤 Font Customization

Replace the default League client font with anything you like.

- **Google Fonts** — paste an import URL (e.g. from [fonts.google.com](https://fonts.google.com))
- **Local font upload** — upload `.ttf`, `.otf`, or `.woff2` files from your PC
- **System fonts** — type the name of any font already installed on your machine
- **Remove** — restore the client's default font instantly

---

### 🪪 Profile Icon

Set a fully custom profile icon — yours alone, or across the entire client.

- **Remote URL** — link any image as your icon
- **Local upload** — upload directly from your PC
- **Built-in crop tool** — interactive 1:1 crop overlay so your icon is always framed perfectly
- **Apply to all players** — optionally replaces icons in the social panel, chat, and hover cards

---

### 👁️ Visibility Controls

Fine-tune exactly what shows up in the client UI:

| Toggle | What it does |
|---|---|
| **Hide RP** | Removes the RP currency from the store bar |
| **Always show hover elements** | Keeps missions, chat, profile, and status permanently visible |
| **Hide TFT (hover mode)** | Hides the TFT nav button unless you hover over it |
| **Hide social panel only** | Collapses the friend list on hover |
| **Hide social + right nav** | Collapses both the friend list and right navigation bar |

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

🇺🇸 English &nbsp;|&nbsp; 🇧🇷 Português &nbsp;|&nbsp; 🇪🇸 Español &nbsp;|&nbsp; 🇩🇪 Deutsch

</div>

---

### 🔧 Under the Hood

| Feature | Description |
|---|---|
| **Profile Skin Unlocker** | Unlocks all skins on the profile page for display |
| **Auto Accept** | Automatically accepts match-found popups |
| **Blur Scrubber** | Force-removes `backdrop-filter` blur from the sidebar, navbar, and social panel |
| **Persistent settings** | Everything is saved via `DataStore` and restored on every client launch |
| **Home button** | Custom icon button injected into the Activity Center tabs |

---

## 📁 File Structure

```
KysoTheme/
├── assets/
│   ├── Main/               ← Your backgrounds go here
│   ├── Loading Screen/
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
├── index.js                ← Entry point
├── settingsPage.js         ← Settings UI & all apply/persist logic
├── backgroundSelector.js
├── autoaccept.js
└── imgUtils.js
```

---

## 🖼️ Adding Custom Backgrounds

Drop any supported file into `assets/Main/` and reference it in the settings panel:

```
//plugins/KysoTheme/assets/Main/yourfile.ext
```

Or just use the **"Upload local file"** button in the settings page — no paths needed.

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

Made with ❤️ by **Kyso** &nbsp;·&nbsp; Built for [Pengu Loader](https://pengu.lol)

</div>

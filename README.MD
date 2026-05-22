# KysoTheme v2.0

![image](https://github.com/user-attachments/assets/3c8eb00a-8b10-4773-9f63-779804ee9e3d)

A clean and highly customizable League of Legends client theme powered by [Pengu Loader](https://pengu.lol). Version 2.0 brings a complete settings panel, video backgrounds, dynamic accent colors, font/icon customization, and much more — all configurable without touching any file.

---

## Requirements

- [Pengu Loader](https://pengu.lol) **0.5.0 or above**

---

## Installation

1. Download the latest release from the [Releases](https://github.com/kyso1/KysoTheme/releases) page.
2. Extract the contents into your Pengu Loader plugins folder:

```
(Pengu root installation folder)/
└── plugins/
    └── KysoTheme/
        ├── assets/
        ├── main-theme/
        ├── utilsCss/
        ├── utilsImg/
        ├── index.js
        ├── settingsPage.js
        ├── backgroundSelector.js
        ├── autoaccept.js
        └── imgUtils.js
```

3. Launch the League client — KysoTheme loads automatically.

---

## What's New in v2.0

### ⚙️ Native Settings Page

KysoTheme now injects a **dedicated settings tab** directly into the League client's settings panel. Every feature is configurable through a clean UI — no file editing required.

Open it via: **Settings → KysoTheme**

---

### 🖼️ Background System (fully revamped)

- **Preset selector** — choose from included backgrounds with a single click
- **URL input** — point to any image, GIF, or video URL (local plugin paths supported: `//plugins/KysoTheme/assets/...`)
- **Local file upload** — upload images, GIFs, or videos directly from your PC (images ≤ 2 MB are stored as base64; larger files or videos use a path reference)
- **Video backgrounds** — full support for `.mp4` and `.webm` videos as the client background
- **Media type selector** — auto-detect or manually set: Image, Animated GIF, or Video
- **Open assets folder** button for quick access to local asset files

---

### 🎨 Accent Color Theme

- **Custom accent color** — pick any hex color to recolor the theme's accent elements (borders, icons, buttons)
- **Auto-extract from background** — automatically samples the dominant color from the current background image
- **Color presets** — one-click preset colors included
- **Reset to white** — restores the default white accent

---

### 🔤 Font Customization

- **Google Fonts support** — paste any Google Fonts import URL to use a custom font
- **Local font upload** — upload a `.ttf`, `.otf`, or `.woff2` font file from your PC
- **Font name field** — use any system-installed font without a URL
- Remove the custom font to restore the client default

---

### 🖼️ Profile Icon Customization

- **Custom icon via URL** — set any remote image as your profile icon
- **Local icon upload** — upload an icon from your PC
- **Built-in crop tool** — interactive 1:1 crop overlay to frame your icon perfectly before applying
- **Apply to all players** toggle — optionally replaces icons for all players in the social panel, chat, and hover cards (off = only your own icon)

---

### 👁️ Visibility Controls

Fine-tune what's visible in the client:

| Option                         | Description                                                                       |
| ------------------------------ | --------------------------------------------------------------------------------- |
| **Hide RP**                    | Hides the RP currency display in the store                                        |
| **Always show hover elements** | Keeps missions, chat, profile, and status always visible (disables hover-to-show) |
| **Hide TFT (hover mode)**      | Hides the TFT nav button unless hovered                                           |
| **Hide social panel only**     | Hides the friend list panel on hover                                              |
| **Hide social + right nav**    | Hides both the friend list and the right navigation bar on hover                  |

---

### 🚪 Sliding-Door Buttons

Two optional tab buttons that slide UI sections out of view:

- **Hide Navbar button** — a vertical tab on the left edge that slides the top navigation bar out of view. Keeps Blue Essence visible optionally.
- **Hide Social Panel button** — a vertical tab on the right edge that slides the social/friend panel out of view

Both states persist between client sessions.

---

### 🌍 Multi-Language Support

The settings page is fully translated into:

- 🇺🇸 English
- 🇧🇷 Portuguese (Brazilian)
- 🇪🇸 Spanish
- 🇩🇪 German

Language is auto-detected from the client locale.

---

### 🔧 Other Improvements

- **Profile Skin Unlocker** — shows all skins on the profile page via property descriptor injection
- **Auto Accept** — automatically accepts match-found popups
- **Blur Scrubber** — force-removes `backdrop-filter` blur effects from the sidebar, navigation bar, and social panel for a cleaner look
- **Persistent settings** — all settings are saved via `DataStore` and restored automatically on every client launch
- **Home button** — custom icon button added to the Activity Center tabs

---

## File Structure

```
KysoTheme/
├── assets/
│   ├── Main/          ← Background images & videos
│   ├── Loading Screen/
│   ├── ModeSwitcher/
│   ├── Runes and Select/
│   ├── Collections/
│   └── Older/
├── main-theme/
│   └── theme.css      ← Core CSS (font, layout, hover effects)
├── utilsCss/
│   ├── ThemeSettings.css
│   ├── AutoAccept.css
│   └── DodgeButton.css
├── index.js           ← Entry point
├── settingsPage.js    ← Settings UI + all apply/persist logic
├── backgroundSelector.js
├── autoaccept.js
└── imgUtils.js
```

---

## Adding Your Own Backgrounds

Drop any `.jpg`, `.png`, `.webp`, `.gif`, `.mp4`, or `.webm` file into `assets/Main/` and reference it in the settings panel using:

```
//plugins/KysoTheme/assets/Main/yourfile.ext
```

Or use the **"Upload local file"** option directly in the settings page.

---

## Credits

- Theme by **Kyso**
- Built for [Pengu Loader](https://pengu.lol)

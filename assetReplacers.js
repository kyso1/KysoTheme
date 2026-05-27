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

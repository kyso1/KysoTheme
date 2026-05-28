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
       }
       img {
         content: url("${url}") !important;
         width: 100% !important;
         height: 100% !important;
         object-fit: cover !important;
         object-position: center !important;
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

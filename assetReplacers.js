// Pure module — DOM mutation + manifest loading. No DataStore / i18n / DEFAULTS coupling.
// Callers pass already-resolved URLs (empty string = clear override).

const PLUGIN_NAME = "KysoTheme";
const PLUGIN_ASSETS_BASE = `//plugins/${PLUGIN_NAME}/assets/`;

export function pluginAsset(relPath) {
  if (!relPath) return "";
  const s = String(relPath);
  // Absolute URLs (http(s), //, data:) pass through so manifest entries can
  // point at LCU built-in assets (ex.: //plugins/rcp-fe-lol-static-assets/...).
  if (/^(https?:)?\/\//.test(s) || s.startsWith("data:")) return s;
  return PLUGIN_ASSETS_BASE + s.replace(/^\/+/, "");
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

// Deep query: walks light DOM + every shadow root recursively, returns every
// element matching `tagName`. Needed because regalia elements appear inside
// at least: lol-regalia-profile-v2-element (profile page),
// lol-social-summoner-hovercard (sidebar hover preview), and chat hover cards.
function _findAllDeep(tagName, root = document) {
  const results = [];
  const visit = (node) => {
    if (!node) return;
    if (typeof node.querySelectorAll === "function") {
      const matches = node.querySelectorAll(tagName);
      for (const el of matches) results.push(el);
    }
    // Walk descendants searching for shadow roots
    if (typeof node.createTreeWalker === "function") {
      const walker = node.createTreeWalker(node, NodeFilter.SHOW_ELEMENT);
      let n;
      while ((n = walker.nextNode())) {
        if (n.shadowRoot) visit(n.shadowRoot);
      }
    }
  };
  visit(root);
  return results;
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

// applyBanner — injects override style into the shadow root of EVERY
// lol-regalia-banner-v2-element currently mounted. Covers profile page,
// sidebar profile hover card, chat hover cards — all banner surfaces.
let _bannerObserver = null;
let _currentBannerUrl = "";

const BANNER_CSS = (url) => url
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

function _updateBannerDom(url) {
  const banners = _findAllDeep("lol-regalia-banner-v2-element");
  for (const banner of banners) {
    if (!banner.shadowRoot) continue;
    const style = ensureStyleIn(banner.shadowRoot, "kyso-banner-override");
    if (!style) continue;
    style.textContent = BANNER_CSS(url);
  }
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

// applyCrest — injects override style into the shadow root of EVERY
// lol-regalia-crest-v2-element currently mounted (profile page + hover cards).
let _crestObserver = null;
let _currentCrestUrl = "";

const CREST_CSS = (url) => url
  ? `:host, :host > div, .crest, [class*="crest"] {
       background-image: url("${url}") !important;
       background-size: contain !important;
       background-position: center !important;
       background-repeat: no-repeat !important;
     }
     :host img, :host svg {
       opacity: 0 !important;
     }`
  : "";

function _updateCrestDom(url) {
  const crests = _findAllDeep("lol-regalia-crest-v2-element");
  for (const crest of crests) {
    if (!crest.shadowRoot) continue;
    const style = ensureStyleIn(crest.shadowRoot, "kyso-crest-override");
    if (!style) continue;
    style.textContent = CREST_CSS(url);
  }
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

// applyCrestRank — overrides the rank crest/emblem to a chosen LoL tier's game
// default by setting ranked-tier / ranked-division (the client renders the
// matching art) plus the emblem subheader text. Empty tier = no override (keep
// the player's real rank). Master/Grandmaster/Challenger have no division, so
// ranked-division gets the letter "O" to clear it; other tiers default to "I".
let _crestRankObserver = null;
let _currentCrestRank = "";

const _RANK_TITLE = (tier) =>
  tier ? tier.charAt(0) + tier.slice(1).toLowerCase() : "";

function _updateCrestRankDom(tier) {
  if (!tier) return;
  const division = ["MASTER", "GRANDMASTER", "CHALLENGER"].includes(tier) ? "O" : "I";
  const setAttrs = (el) => {
    if (!el) return;
    if (el.getAttribute("ranked-tier") !== tier) el.setAttribute("ranked-tier", tier);
    if (el.getAttribute("ranked-division") !== division) el.setAttribute("ranked-division", division);
  };
  // Crest elements (profile page + hover cards): attributes on the element.
  _findAllDeep("lol-regalia-crest-v2-element").forEach(setAttrs);
  // Emblem elements: attributes on the inner `div > div` inside the shadow root.
  _findAllDeep("lol-regalia-emblem-element").forEach((em) => {
    if (em.shadowRoot) setAttrs(em.shadowRoot.querySelector("div > div"));
  });
  // Emblem subheader text → the chosen tier label.
  const label = _RANK_TITLE(tier);
  document
    .querySelectorAll(".style-profile-emblem-subheader-ranked > div")
    .forEach((el) => {
      if (el.textContent !== label) el.textContent = label;
    });
}

export function applyCrestRank(tier) {
  _currentCrestRank = (tier || "").toUpperCase();
  if (_crestRankObserver) { _crestRankObserver.disconnect(); _crestRankObserver = null; }
  _updateCrestRankDom(_currentCrestRank);
  if (!_currentCrestRank) return;
  _crestRankObserver = new MutationObserver(() => _updateCrestRankDom(_currentCrestRank));
  _crestRankObserver.observe(document.body, { childList: true, subtree: true });
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

// applyProfileBgTransparent — zeroes the profile-page background switcher so a
// custom #kyso-global-bg shows through. The backdrop lives in the LIGHT DOM
// (.style-profile-backdrop-component … .uikit-background-switcher), so a single
// document-level <style> rule covers current and future profile mounts — no
// shadow-root walking or MutationObserver needed.
let _profileBgStyle = null;

export function applyProfileBgTransparent(hidden) {
  if (!_profileBgStyle || !_profileBgStyle.isConnected) {
    _profileBgStyle =
      document.getElementById("kyso-profilebg-style") ||
      (() => {
        const s = document.createElement("style");
        s.id = "kyso-profilebg-style";
        document.head.appendChild(s);
        return s;
      })();
  }
  _profileBgStyle.textContent = hidden
    ? `.style-profile-backdrop-component .style-profile-backdrop-container .uikit-background-switcher {
         background: transparent !important;
         background-image: none !important;
         opacity: 0 !important;
       }`
    : "";
}

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
  if (_bannerHideObserver) { _bannerHideObserver.disconnect(); _bannerHideObserver = null; }
  _updateBannerHideDom(_bannerHidden);
  if (!_bannerHidden) return;
  _bannerHideObserver = new MutationObserver(() => { _updateBannerHideDom(_bannerHidden); });
  _bannerHideObserver.observe(document.body, { childList: true, subtree: true });
}

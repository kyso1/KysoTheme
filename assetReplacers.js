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
    if (!node || typeof node.querySelectorAll !== "function") return;
    node.querySelectorAll(tagName).forEach((el) => results.push(el));
    // Recurse into EVERY nested shadow root. The previous TreeWalker approach
    // relied on createTreeWalker, which exists on Document but NOT on ShadowRoot
    // — so it silently stopped at the first shadow level and missed elements
    // nested 2+ shadows deep (e.g. the regalia hovercard crest, and the
    // .lol-regalia-summoner-icon inside it).
    node.querySelectorAll("*").forEach((el) => {
      if (el.shadowRoot) visit(el.shadowRoot);
    });
  };
  visit(root);
  return results;
}

// Local player's summonerId — hovercard overrides are self-only. Resolved once
// from the LCU; until it arrives, hovercard/self-guarded overrides no-op, then
// re-apply via the onResolved callback.
let _selfSummonerId = "";
let _selfPuuid = ""; // local player's puuid — matches lobby slots' voice-puuid
let _selfGameName = ""; // local Riot-ID gameName, normalized (trim+lowercase) — used by _profileIsSelf
let _selfIdPromise = null;
function ensureSelfSummonerId(onResolved) {
  if (_selfSummonerId) { if (onResolved) onResolved(_selfSummonerId); return; }
  if (!_selfIdPromise) {
    _selfIdPromise = fetch("/lol-summoner/v1/current-summoner")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("HTTP " + r.status))))
      .then((d) => { _selfSummonerId = String(d.summonerId || ""); _selfPuuid = String(d.puuid || ""); _selfGameName = String(d.gameName || d.displayName || "").trim().toLowerCase(); return _selfSummonerId; })
      .catch((e) => {
        console.warn("[KysoTheme] self summonerId fetch failed:", e);
        _selfIdPromise = null;
        return "";
      });
  }
  _selfIdPromise.then((id) => { if (id && onResolved) onResolved(id); });
}

// applyProfileIcon — self-only. Touches profile page crest + sidebar avatar.
// Empty URL → skip mutations (lets Riot default render).
let _profileIconObserver = null;
let _currentProfileIconUrl = "";

function _updateProfileIconDom(url) {
  // Profile page crest (shadow root) — self-only: never paint another player's profile.
  const regaliaProfile = document.querySelector("lol-regalia-profile-v2-element");
  if (regaliaProfile && regaliaProfile.shadowRoot && _profileIsSelf()) {
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

  // Lobby player slots + parties banner — self-only. A crest-v2 renders its icon
  // from profile-icon-url (native, survives the component's re-renders); also
  // paint the already-rendered .lol-regalia-summoner-icon bg for an immediate
  // swap. Self is identified per-surface (see below); never touches teammates.
  const _paintCrestIcon = (cr) => {
    if (!cr) return;
    if (cr.getAttribute("profile-icon-url") !== url) cr.setAttribute("profile-icon-url", url);
    const next = `url("${url}")`;
    _findAllDeep(".lol-regalia-summoner-icon", cr.shadowRoot || cr).forEach((ic) => {
      if (ic.style.backgroundImage !== next) {
        ic.style.backgroundImage = next;
        ic.style.backgroundSize = "cover";
        ic.style.backgroundPosition = "center";
      }
    });
  };

  // Lobby slot crests live in the light DOM; the self slot's crest-v2 carries
  // voice-puuid === local puuid. Only that one gets the custom icon.
  if (_selfPuuid) {
    document
      .querySelectorAll(".player-slot__crest-wrapper > lol-regalia-crest-v2-element")
      .forEach((cr) => {
        if (String(cr.getAttribute("voice-puuid") || "") === _selfPuuid) _paintCrestIcon(cr);
      });
  }

  // Parties banner — .lobby-banner.local marks the local player's banner, so no
  // puuid check needed. Paint any crest-v2 + icon div nested in its shadow tree.
  document.querySelectorAll("lol-regalia-parties-v2-element").forEach((pv) => {
    if (!pv.closest || !pv.closest(".lobby-banner.local")) return;
    _findAllDeep("lol-regalia-crest-v2-element", pv.shadowRoot || pv).forEach(_paintCrestIcon);
    const next = `url("${url}")`;
    _findAllDeep(".lol-regalia-summoner-icon", pv.shadowRoot || pv).forEach((ic) => {
      if (ic.style.backgroundImage !== next) {
        ic.style.backgroundImage = next;
        ic.style.backgroundSize = "cover";
        ic.style.backgroundPosition = "center";
      }
    });
  });
}

export function applyProfileIcon(url) {
  _currentProfileIconUrl = url || "";
  if (_profileIconObserver) _profileIconObserver.disconnect();
  if (!_currentProfileIconUrl) return; // empty → leave Riot default

  _updateProfileIconDom(_currentProfileIconUrl);
  // Resolve local puuid so the self lobby-slot match can take effect once known.
  ensureSelfSummonerId(() => _updateProfileIconDom(_currentProfileIconUrl));
  // Debounced: the callback now deep-walks parties-v2 shadow trees, too heavy to
  // run per-mutation on the busy lobby DOM.
  _profileIconObserver = new MutationObserver(
    _crestDebounce(() => _updateProfileIconDom(_currentProfileIconUrl), 120),
  );
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
    // Self-only: paint our crest image; clear it on others' surfaces (an element
    // may be reused, so explicitly blank disallowed ones).
    style.textContent = _crestImgAllowed(crest) ? CREST_CSS(url) : "";
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
let _currentCrestDivision = "I";
let _currentCrestChangeAll = false;
let _currentCrestLP = "";
const _APEX_TIERS = ["MASTER", "GRANDMASTER", "CHALLENGER"];

const _RANK_TITLE = (tier) =>
  tier ? tier.charAt(0) + tier.slice(1).toLowerCase() : "";

// Coalesce the crest observer's mutation bursts (it deep-walks shadow roots,
// so running per-mutation on the busy client DOM is expensive).
function _crestDebounce(fn, ms) {
  let h = null;
  return () => { if (h) clearTimeout(h); h = setTimeout(fn, ms); };
}

// A crest-v2 inside a regalia hovercard is overridden only for the local player
// (hovercards now reachable since shadow roots are forced open). Crests elsewhere
// (profile page, sidebar) are unaffected by this guard.
// Returns the lol-regalia-hovercard-v2-element ancestor of `el` (crossing shadow
// boundaries) or null if `el` is not inside a hovercard.
function _hovercardHost(el) {
  let n = el;
  for (let i = 0; i < 12 && n; i++) {
    if (n.tagName === "LOL-REGALIA-HOVERCARD-V2-ELEMENT") return n;
    const r = n.getRootNode ? n.getRootNode() : null;
    n = r && r.host ? r.host : (n.parentElement || null);
  }
  return null;
}
function _crestAllowed(el) {
  const host = _hovercardHost(el);
  if (!host) return true; // not inside a hovercard
  return String(host.getAttribute("summoner-id") || "") === _selfSummonerId;
}

// Returns the lol-regalia-profile-v2-element ancestor of `el` (crossing shadow
// boundaries) or null. The profile-page crest lives inside that element's
// (forced-open) shadow root, so a plain .closest() can't reach the host.
function _profileHost(el) {
  let n = el;
  for (let i = 0; i < 12 && n; i++) {
    if (n.tagName === "LOL-REGALIA-PROFILE-V2-ELEMENT") return n;
    const r = n.getRootNode ? n.getRootNode() : null;
    n = r && r.host ? r.host : (n.parentElement || null);
  }
  return null;
}

// True only when the open full profile page belongs to the local player.
// Detection: compare the displayed Riot-ID/name to the local gameName. Other
// players' profile pages use the same element + .style-profile-* classes, so a
// name compare is how we tell them apart. FAILS CLOSED — unknown local name or
// no name node => false, so we never paint a profile we can't confirm is ours.
//
// NAME_SELECTORS is a best-effort candidate list; the correct one is confirmed
// in-client (Step 5). Add/replace the real selector there if none match.
function _profileIsSelf() {
  if (!_selfGameName) return false;
  const profile = document.querySelector("lol-regalia-profile-v2-element");
  if (!profile) return false;
  const NAME_SELECTORS = [
    ".style-profile-header-username",
    ".style-profile-username",
    ".style-profile-display-name",
    "[class*='profile'][class*='username']",
    "[class*='profile'][class*='name']",
  ];
  let nameEl = null;
  for (const sel of NAME_SELECTORS) {
    nameEl =
      profile.querySelector(sel) ||
      (profile.shadowRoot && profile.shadowRoot.querySelector(sel));
    if (nameEl) break;
  }
  if (!nameEl) return false;
  const shown = String(nameEl.textContent || "").trim().toLowerCase().replace(/#.*$/, "").trim();
  const mine = _selfGameName.replace(/#.*$/, "").trim();
  return shown !== "" && shown === mine;
}

// Per-crest self-guard for crest-v2 elements anywhere in the document:
//   hovercard  -> allowed only for the local player (summoner-id match)
//   profile pg -> allowed only when the open profile is ours (_profileIsSelf)
//   elsewhere  -> unaffected (sidebar/lobby) — returns true
function _crestImgAllowed(crest) {
  if (_hovercardHost(crest)) return _crestAllowed(crest);
  if (_profileHost(crest)) return _profileIsSelf();
  return true;
}

// The hovercard crest-v2 stops re-rendering from ranked-tier/ranked-division
// once it has the regalia-crest-loaded state, so set the rendered art directly:
// wings + tier plate backgrounds and the division number.
function _applyHovercardCrestArt(rootShadow, tier, dvText) {
  const tl = tier.toLowerCase();
  const wings = `url("/fe/lol-static-assets/images/ranked-emblem/wings/wings_${tl}_plate.png")`;
  const plate = `url("/fe/lol-static-assets/images/ranked-emblem/tier/${tl}-plate.png")`;
  _findAllDeep(".lol-regalia-ranked-border-container", rootShadow).forEach((w) => {
    if (w.style.backgroundImage !== wings) w.style.backgroundImage = wings;
  });
  _findAllDeep(".lol-regalia-rank-division-container", rootShadow).forEach((p) => {
    if (p.style.backgroundImage !== plate) p.style.backgroundImage = plate;
  });
  _findAllDeep(".lol-regalia-rank-division-text", rootShadow).forEach((d) => {
    if (d.textContent !== dvText) d.textContent = dvText;
  });
}

// The hovercard popup shows, per .hover-card-rank: a mini emblem
// <img.hover-card-rank-image src=".../<tier>.svg"> and a raw text node sibling
// like "Emerald I (TFT)". Swap the emblem tier and rewrite the text's rank
// prefix to the chosen elo, preserving the " (queue)" suffix. The sibling
// .hover-card-challenge-crystal is left untouched (it's the challenge level).
function _applyHovercardRank(root, tier, eloLabel) {
  const tl = tier.toLowerCase();
  root.querySelectorAll(".hover-card-rank").forEach((rank) => {
    rank.querySelectorAll(".hover-card-rank-image").forEach((img) => {
      const cur = img.getAttribute("src") || "";
      if (!/\.svg/i.test(cur)) return;
      const next = cur.replace(/[a-z-]+\.svg(\?[^#]*)?$/i, (m, q) => tl + ".svg" + (q || ""));
      if (cur !== next) img.setAttribute("src", next);
    });
    rank.childNodes.forEach((n) => {
      if (n.nodeType !== 3 || !n.textContent.trim()) return;
      const m = n.textContent.match(/\(.*$/); // the "(TFT)" queue suffix
      const next = m ? `${eloLabel} ${m[0]}` : eloLabel;
      if (n.textContent.trim() !== next.trim()) n.textContent = next;
    });
  });
}

// The crest component re-renders the division subtree (wrapper > plate > text)
// asynchronously after load — a shadow mutation the document.body observer never
// sees, so the override gets reverted. Watch the crest's OWN shadow root and
// reapply (disconnect-during-write so our own writes don't re-trigger it).
const _watchedCrests = new WeakSet();
const _crestArtObsOpts = {
  childList: true, subtree: true, attributes: true, attributeFilter: ["style", "class"],
};
function _watchHovercardCrest(el) {
  if (_watchedCrests.has(el) || !el.shadowRoot) return;
  _watchedCrests.add(el);
  let ob = null;
  const reapply = () => {
    const a = el.__kysoCrestArt;
    if (!a || !el.shadowRoot) return;
    if (ob) ob.disconnect();
    _applyHovercardCrestArt(el.shadowRoot, a.tier, a.dvText);
    if (ob) ob.observe(el.shadowRoot, _crestArtObsOpts);
  };
  ob = new MutationObserver(_crestDebounce(reapply, 50));
  ob.observe(el.shadowRoot, _crestArtObsOpts);
}

// Applies the current crest-rank + LP override to the DOM. Reads the module
// state vars so the observer can call it with no args. LP is independent of the
// tier: setting only LP (no rank) still rewrites the tooltip LP span.
function _updateCrestRankDom() {
  const tier = _currentCrestRank;
  const division = _currentCrestDivision;
  const changeAll = _currentCrestChangeAll;
  const lp = _currentCrestLP;
  const hasLP = lp !== "" && lp != null;
  if (!tier && !hasLP) return;

  // Profile-page surfaces (.style-profile-*, tooltip queues, emblem) are painted
  // only on our own profile. Hovercard crests use their own _crestAllowed guard.
  const selfProfile = _profileIsSelf();
  const div = _APEX_TIERS.includes(tier) ? "O" : (division || "I");
  const tierLower = tier ? tier.toLowerCase() : "";
  const title = _RANK_TITLE(tier);
  // Tooltip elo label: apex = just the tier ("Challenger"); else "Emerald I".
  const eloLabel = !tier ? "" : (_APEX_TIERS.includes(tier) ? title : `${title} ${div}`);
  const setAttrs = (el, t) => {
    if (!el) return;
    if (el.getAttribute("ranked-tier") !== t) el.setAttribute("ranked-tier", t);
    if (el.getAttribute("ranked-division") !== div) el.setAttribute("ranked-division", div);
  };

  if (tier) {
    // Main profile crest (active queue): UPPERCASE ranked-tier. Hovercard crests
    // are limited to the local player via _crestAllowed.
    const dvText = _APEX_TIERS.includes(tier) ? "" : div;
    _findAllDeep("lol-regalia-crest-v2-element").forEach((el) => {
      if (!_crestImgAllowed(el)) return;
      setAttrs(el, tier);
      // Hovercard crest won't re-render from the attrs → paint art directly and
      // keep it painted across the component's async re-renders.
      const host = _hovercardHost(el);
      if (host && el.shadowRoot) {
        el.__kysoCrestArt = { tier, dvText };
        _applyHovercardCrestArt(el.shadowRoot, tier, dvText);
        _watchHovercardCrest(el);
        const proot = _hovercardPopupRoot(host);
        if (proot) _applyHovercardRank(proot, tier, eloLabel);
      }
    });
    // Emblem subheader text → the chosen tier label (self profile page only).
    if (selfProfile) {
      document
        .querySelectorAll(".style-profile-emblem-subheader-ranked > div")
        .forEach((el) => { if (el.textContent !== title) el.textContent = title; });
    }
  }

  // Profile emblem header mastery-score → show the chosen LP (self profile page only).
  if (hasLP && selfProfile) {
    _findAllDeep(".style-profile-champion-mastery-score").forEach((el) => {
      if (el.textContent !== String(lp)) el.textContent = String(lp);
    });
  }

  // Active queue = the emblem-card header whose text matches a tooltip queue
  // name (fallback: first queue). Limits the override to the displayed queue
  // unless "change for all" is on. Used for both crest and LP.
  const queues = _findAllDeep(".ranked-tooltip-queue");
  const qName = (q) => {
    const n = q.querySelector(".ranked-tooltip-queue-name");
    return n ? n.textContent.trim() : "";
  };
  let activeQueue = "";
  if (!changeAll && queues.length) {
    const names = queues.map(qName);
    const headers = _findAllDeep(".style-profile-emblem-header-title").map((h) => h.textContent.trim());
    activeQueue = headers.find((h) => names.includes(h)) || names[0];
  }

  if (selfProfile) {
    queues.forEach((q) => {
      if (!changeAll && qName(q) !== activeQueue) return;
      if (tier) {
        const em = q.querySelector("lol-regalia-emblem-element");
        if (em) {
          setAttrs(em, tierLower); // emblem renders from a LOWERCASE ranked-tier
          if (em.shadowRoot) setAttrs(em.shadowRoot.querySelector("div > div"), tierLower);
        }
        const tEl = q.querySelector(".ranked-tooltip-queue-tier");
        if (tEl && tEl.textContent !== eloLabel) tEl.textContent = eloLabel;
      }
      if (hasLP) {
        const lpEl = q.querySelector(".style-profile-ranked-crest-tooltip-lp");
        const spans = lpEl ? lpEl.querySelectorAll("span") : [];
        if (spans[1] && spans[1].textContent !== String(lp)) spans[1].textContent = String(lp);
      }
    });

    // Emblem elements outside tooltip queues (e.g. the main profile emblem) get
    // only the crest override.
    if (tier) {
      _findAllDeep("lol-regalia-emblem-element").forEach((em) => {
        if (em.closest && em.closest(".ranked-tooltip-queue")) return; // handled above
        setAttrs(em, tierLower);
        if (em.shadowRoot) setAttrs(em.shadowRoot.querySelector("div > div"), tierLower);
      });
    }
  }
}

export function applyCrestRank(tier, division, changeAll, lp) {
  _currentCrestRank = (tier || "").toUpperCase();
  _currentCrestDivision = (division || "I").toUpperCase();
  _currentCrestChangeAll = !!changeAll;
  _currentCrestLP = lp == null ? "" : String(lp).trim();
  if (_crestRankObserver) { _crestRankObserver.disconnect(); _crestRankObserver = null; }
  _updateCrestRankDom();
  // Resolve self-id so the hovercard crest self-guard can take effect once known.
  ensureSelfSummonerId(() => _updateCrestRankDom());
  // Keep observing while EITHER a rank or an LP override is active (the tooltip
  // mounts on hover, after this runs).
  if (!_currentCrestRank && _currentCrestLP === "") return;
  _crestRankObserver = new MutationObserver(_crestDebounce(_updateCrestRankDom, 120));
  _crestRankObserver.observe(document.body, { childList: true, subtree: true });
}

// applyHovercard — overrides the LOCAL player's regalia hovercard popup only:
// summoner icon (custom), mastery-score text (= LP override), and the backdrop
// splash. The crest TIER is handled by applyCrestRank (self-guarded). Scoped by
// matching the hovercard host's summoner-id to the local player.
let _hoverObserver = null;
let _hoverIcon = "";
let _hoverLp = "";
let _hoverBackdrop = "";
const _HOVER_GRADIENT =
  "linear-gradient(to top, #1A1C21 13.41%, rgba(196, 196, 196, 0) 75.55%)";

// The hovercard popup siblings (#hover-card-backdrop, .hover-card-mastery-score)
// live in a shadow root above the regalia element. Climb host boundaries to find
// the root that contains them.
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
    // Summoner icon — inside the crest shadow under the regalia element.
    if (_hoverIcon && card.shadowRoot) {
      // The crest-v2 renders its icon from profile-icon-url (same mechanism as
      // the profile-page crest), which survives the component's re-renders.
      _findAllDeep("lol-regalia-crest-v2-element", card.shadowRoot).forEach((cr) => {
        if (cr.getAttribute("profile-icon-url") !== _hoverIcon) {
          cr.setAttribute("profile-icon-url", _hoverIcon);
        }
      });
      // Fallback: set the already-rendered icon div background directly.
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
        // Image is pre-cropped to the backdrop ratio, so fill exactly (100% 100%)
        // instead of cover — avoids the sub-pixel overflow that leaked ~1px past
        // the card's bottom edge.
        if (bd.style.backgroundImage !== next) bd.style.backgroundImage = next;
        if (bd.style.backgroundSize !== "100% 100%") bd.style.backgroundSize = "100% 100%";
        if (bd.style.backgroundPosition !== "center") bd.style.backgroundPosition = "center";
        if (bd.style.backgroundRepeat !== "no-repeat") bd.style.backgroundRepeat = "no-repeat";
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
// (.style-profile-backdrop-component … .uikit-background-switcher). Self-only: a
// plain CSS rule can't tell whose profile is open, so a single document-level
// <style> rule is toggled on/off by a body MutationObserver keyed to
// _profileIsSelf() — applied only while the local player's own profile is mounted.
let _profileBgStyle = null;
let _profileBgObserver = null;
let _profileBgHidden = false;

function _updateProfileBgStyle() {
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
  // Self-only: a plain CSS rule can't tell whose profile is open, so toggle the
  // rule on/off as the local player's profile mounts/unmounts.
  _profileBgStyle.textContent = (_profileBgHidden && _profileIsSelf())
    ? `.style-profile-backdrop-component .style-profile-backdrop-container .uikit-background-switcher {
         background: transparent !important;
         background-image: none !important;
         opacity: 0 !important;
       }`
    : "";
}

export function applyProfileBgTransparent(hidden) {
  _profileBgHidden = !!hidden;
  _updateProfileBgStyle();
  // Resolve self-id so the name compare can succeed once known.
  ensureSelfSummonerId(() => _updateProfileBgStyle());
  if (_profileBgObserver) { _profileBgObserver.disconnect(); _profileBgObserver = null; }
  if (!_profileBgHidden) return; // off → nothing to maintain
  _profileBgObserver = new MutationObserver(_crestDebounce(_updateProfileBgStyle, 120));
  _profileBgObserver.observe(document.body, { childList: true, subtree: true });
}

const _SCREENBG_BASE = "//plugins/KysoTheme/assets/";
function _screenBgUrl(rel) {
  if (!rel) return "";
  const s = String(rel);
  if (/^(https?:)?\/\//.test(s) || s.startsWith("data:")) return s;
  return _SCREENBG_BASE + s.replace(/^\/+/, "");
}
function _resolveScreenBg(cat, s) {
  if (s[cat + "Source"] === "web") return s[cat + "Web"] || "";
  return _screenBgUrl(s[cat + "Local"] || "");
}

// v3.2 Bucket B — per-screen backgrounds. Each screen ON = its resolved image;
// OFF = transparent so the global #kyso-global-bg shows through. One head style.
export function applyScreenBackgrounds(settings) {
  let style = document.querySelector("#kyso-screenbg-style");
  if (!style) {
    style = document.createElement("style");
    style.id = "kyso-screenbg-style";
    document.head.appendChild(style);
  }
  const bgCover = (url) =>
    `background-image: url("${url}") !important; background-size: cover !important; background-position: center center !important; background-repeat: no-repeat !important;`;
  const transparent = `background: transparent !important; background-image: none !important;`;
  let css = "";

  // Collections
  if (settings.collectionsBgEnabled) {
    const u = _resolveScreenBg("collectionsBg", settings);
    css += `.collections-application, .collections-routes { ${u ? bgCover(u) : transparent} }\n`;
  } else {
    css += `.collections-application, .collections-routes { ${transparent} }\n`;
  }

  // Champ select
  if (settings.champSelectBgEnabled) {
    const u = _resolveScreenBg("champSelectBg", settings);
    css += `.champion-select { ${u ? bgCover(u) : transparent} }\n`;
  } else {
    css += `.champion-select { ${transparent} }\n`;
  }

  // Runes
  if (settings.runesBgEnabled) {
    const u = _resolveScreenBg("runesBg", settings);
    css += `.perks-body-content { ${u ? bgCover(u) : transparent} }\n`;
  } else {
    css += `.perks-body-content { ${transparent} }\n`;
  }

  // Mode switcher (default OFF/transparent; ON shows image at full opacity)
  if (settings.modeSwitcherBgEnabled) {
    const u = _resolveScreenBg("modeSwitcherBg", settings);
    css += `:host .lol-uikit-background-switcher-image, .parties-view .parties-background .uikit-background-switcher { content: url("${u}") !important; opacity: 1 !important; width: auto !important; }\n`;
  } else {
    css += `:host .lol-uikit-background-switcher-image, .parties-view .parties-background .uikit-background-switcher { opacity: 0 !important; }\n`;
  }

  style.textContent = css;
}

// v3.2 — greys out an Assets-tab screen-bg picker when its UI Editor toggle is
// OFF, with a hint pointing to the UI Editor. `panel` = the Assets panel root.
const _SCREENBG_CATS = ["collectionsBg", "champSelectBg", "runesBg", "modeSwitcherBg"];
export function applyScreenBgDisabledUI(panel, settings) {
  if (!panel) return;
  _SCREENBG_CATS.forEach((cat) => {
    const block = panel.querySelector(`.kyso-asset-section[data-cat="${cat}"]`);
    if (!block) return;
    const enabled = !!settings[cat + "Enabled"];
    block.classList.toggle("kyso-asset-section--disabled", !enabled);
    block.setAttribute("data-disabled-hint", enabled ? "" : (settings._enableHint || "Enable in UI Editor"));
  });
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

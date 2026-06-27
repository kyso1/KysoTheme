/*
 * @name Kyso UI Editor v3.1
 * @author Kyso
 * @description Kyso UI Editor — customizable clean theme for League of Legends (Pengu Loader)
 * @link https://github.com/kyso1/KysoTheme
 */

import {
  githubIconBase64,
  resetIconBase64,
  folderIconBase64,
  previousBase64,
} from "./imgUtils.js";
import {
  loadBackgroundImages,
  changeBackground,
  nextBackground,
  previousBackground,
  backgroundImages,
  currentBackgroundIndex,
} from "./backgroundSelector.js";
// MTZ plugins — these self-register with window.MTZ as a side effect of being
// imported. Their default export is an empty object (rollup/commonjs artifact),
// NOT a constructor, so they must NOT be `new`-ed. Import for side effects only.
import "./profileskinunlocker.js";
import "./hidefriends.js";
import "./autoaccept.js";
import "./main-theme/theme.css";
import { initSettingsPage } from "./settingsPage.js";
// import { initializeDodgeButton } from './dodgeButton.js';

// Coalesce MutationObserver bursts — the client mutates its DOM constantly, so
// running a whole-document callback once per mutation freezes the main thread.
function _debounce(fn, ms) {
  let h = null;
  return (...a) => {
    if (h) clearTimeout(h);
    h = setTimeout(() => fn(...a), ms);
  };
}

/**
 * Sobrescreve o comportamento do hidefriends.js para usar display:none
 * em vez de visibility:hidden, removendo o espaço ocupado pelo roster.
 */
function initHideButtonDisplayToggle() {
  function applyRosterState(btn) {
    const roster = document.querySelector("lol-social-roster");
    if (!roster) return;
    if (btn.classList.contains("toggled")) {
      roster.style.display = "none";
      roster.style.visibility = ""; // limpa o visibility:hidden do hidefriends.js
    } else {
      roster.style.display = "";
      roster.style.visibility = "";
    }
  }

  function attachToButton(btn) {
    if (btn._kysoDisplayPatched) return;
    btn._kysoDisplayPatched = true;

    // Observa mudanças na classe (toggled/untoggled) com pequeno delay
    // para garantir que o handler original do hidefriends.js já rodou
    new MutationObserver(() => {
      setTimeout(() => applyRosterState(btn), 0);
    }).observe(btn, { attributes: true, attributeFilter: ["class"] });

    // Estado inicial
    applyRosterState(btn);
  }

  // Aguarda o botão ser inserido no DOM pelo hidefriends.js
  const bodyObserver = new MutationObserver(_debounce(() => {
    const btn = document.querySelector(".action-bar-button.hide-button");
    if (btn) attachToButton(btn);
  }, 200));
  bodyObserver.observe(document.body, { childList: true, subtree: true });

  // Tenta imediatamente caso o botão já exista
  const existing = document.querySelector(".action-bar-button.hide-button");
  if (existing) attachToButton(existing);
}

window.addEventListener("load", () => {
  // Inicializa a página de configurações do tema (aplica settings salvas + observa DOM)
  initSettingsPage();

  // ProfileSkinUnlocker / HideFriends / AutoAccept já se registraram no MTZ via
  // import (efeito colateral). NÃO instanciar: o default export é objeto vazio,
  // e `new X()` lança "is not a constructor", abortando todo este handler de
  // load — o que antes matava initBlurScrubber e o patch do botão hide abaixo.
  if (!window.MTZ) {
    console.error("Framework not found!");
  }

  // Corrige o botão hide para usar display:none em vez de visibility
  initHideButtonDisplayToggle();

  // Scrubber de blur — força inline !important nas áreas afetadas
  initBlurScrubber();
});

/**
 * Force-kill backdrop-filter (e filter:blur) em elementos críticos
 * via inline style !important. Inline !important vence qualquer
 * CSS nativo do client, mesmo com seletores mais específicos.
 */
function initBlurScrubber() {
  // Always hard-kill blur on these (chrome/navbar/frame):
  const KILL_TARGETS = [
    "lol-uikit-navigation-bar",
    ".rcp-fe-lol-uikit-frame",
  ];
  // Social surfaces: blur driven by the user's socialBlur slider.
  const SOCIAL_TARGETS = [
    ".lol-social-sidebar",
    ".lol-social-lower-pane-container",
    ".lol-social-roster",
    ".parties-view",
    ".parties-view .parties-content",
    ".parties-content",
  ];

  // Seed from saved settings so blur is correct before the settings UI loads.
  try {
    const raw = DataStore.get("KysoTheme.settings");
    const s = raw ? JSON.parse(raw) : {};
    window.__kysoSocialBlur = Number(s.socialBlur) || 0;
  } catch {
    window.__kysoSocialBlur = 0;
  }

  // Idempotent write — skip if the property is already the target value, so
  // scrub() generates no style mutation when nothing actually needs changing.
  const setIf = (el, prop, val) => {
    if (el.style.getPropertyValue(prop) !== val) {
      el.style.setProperty(prop, val, "important");
    }
  };
  const scrub = () => {
    for (const sel of KILL_TARGETS) {
      document.querySelectorAll(sel).forEach((el) => {
        setIf(el, "backdrop-filter", "none");
        setIf(el, "-webkit-backdrop-filter", "none");
        const cur = getComputedStyle(el).filter;
        if (cur && cur.includes("blur")) setIf(el, "filter", "none");
      });
    }
    const px = Number(window.__kysoSocialBlur) || 0;
    const blurVal = px > 0 ? `blur(${px}px)` : "none";
    for (const sel of SOCIAL_TARGETS) {
      document.querySelectorAll(sel).forEach((el) => {
        setIf(el, "backdrop-filter", blurVal);
        setIf(el, "-webkit-backdrop-filter", blurVal);
      });
    }
  };

  window.__kysoRescrub = scrub;
  scrub();

  // Harden against the freeze this used to cause: (a) debounce so mutation
  // bursts coalesce into one run, and (b) disconnect while scrubbing so the
  // inline-style writes scrub() makes don't re-trigger the observer — "style"
  // is in attributeFilter, so writing styles fed the observer its own changes
  // (a self-sustaining loop). setIf() also drops no-op writes.
  const _scrubOpts = {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["style", "class"],
  };
  let _scrubObserver = null;
  const _scrubOnce = () => {
    if (_scrubObserver) _scrubObserver.disconnect();
    scrub();
    if (_scrubObserver) _scrubObserver.observe(document.documentElement, _scrubOpts);
  };
  _scrubObserver = new MutationObserver(_debounce(_scrubOnce, 150));
  _scrubObserver.observe(document.documentElement, _scrubOpts);
}

function addHomeButton() {
  let activityCenterTabs = document.querySelector(
    "#activity-center .activity-center__tabs",
  );

  if (!activityCenterTabs) {
    console.error("Activity Center Tabs not found!");
    return false;
  }

  if (document.querySelector(".home-button")) {
    console.log("Home button already exists!");
    return false;
  }

  let homeButton = document.createElement("div");
  homeButton.className = "activity-center__tab home-button ember-view";
  homeButton.innerHTML = `
        <button type="button" class="activity-center__tab_content">
            <div class="activity-center__tab_label">
                <div class="activity-center__tab_label_display">Home</div>
            </div>
        </button>
    `;

  activityCenterTabs.insertBefore(homeButton, activityCenterTabs.firstChild);

  homeButton.querySelector("button").onclick = () => {
    console.log("Home button clicked!");
    sessionStorage.setItem("selectedTab", "home");
    loadHomePage();
  };

  return true;
}

function loadHomePage() {
  let contentContainer = document.querySelector(".activity-center-application");

  if (contentContainer) {
    console.log("Content container found!");

    // Clear the screen
    contentContainer.innerHTML = "";
    contentContainer.style.background = "transparent";

    // Create the button container
    let buttonContainer = document.createElement("div");
    buttonContainer.className = "custom-buttons";

    let githubButton = createButton(
      "github-button",
      githubIconBase64,
      "GitHub",
      () => window.open("https://github.com/kyso1", "_blank"),
    );

    let resetButton = createButton(
      "reset-button",
      resetIconBase64,
      "Reset",
      () => location.reload(),
    );

    let openFolderButton = createButton(
      "folder-button",
      folderIconBase64,
      "Folder",
      () => {
        if (window.openPluginsFolder) {
          window.openPluginsFolder("KysoTheme/assets");
        } else {
          console.error("Pengu Loader API not available!");
        }
      },
    );

    let previousButton = createButton(
      "previous-button",
      previousBase64,
      "Previous",
      () => previousBackground(),
    );

    let nextButton = createButton("next-button", previousBase64, "Next", () =>
      nextBackground(),
    );

    buttonContainer.appendChild(githubButton);
    buttonContainer.appendChild(resetButton);
    buttonContainer.appendChild(openFolderButton);
    // buttonContainer.appendChild(previousButton);
    // buttonContainer.appendChild(nextButton);

    contentContainer.appendChild(buttonContainer);

    // Legado: sistema antigo de bg via next/prev no homepage. Substituído pelo
    // #kyso-global-bg fixed body-level (vide settingsPage.js → applyBackground).
    // Mantido só pra não quebrar import; não aplica mais nada.

    console.log("Blank page with buttons generated!");
  } else {
    console.error("Content container not found!");
  }
}

function createButton(buttonClass, iconSrc, altText, onClickHandler) {
  let button = document.createElement("button");
  button.className = `custom-button ${buttonClass}`;
  button.innerHTML = `<img src="${iconSrc}" alt="${altText}" class="button-icon">`;
  button.onclick = onClickHandler;
  return button;
}

let observer = null;
let homeButtonInterval = null;

document.addEventListener("DOMContentLoaded", () => {
  if (addHomeButton()) return;
  observer = new MutationObserver(_debounce(() => {
    if (addHomeButton()) {
      observer.disconnect();
      if (homeButtonInterval) {
        clearInterval(homeButtonInterval);
        homeButtonInterval = null;
      }
    }
  }, 200));

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
});

const checkBodyLoaded = setInterval(() => {
  if (document.body) {
    clearInterval(checkBodyLoaded);
    if (addHomeButton()) return;

    homeButtonInterval = setInterval(() => {
      if (addHomeButton()) {
        clearInterval(homeButtonInterval);
        if (observer) {
          observer.disconnect();
          observer = null;
        }
      }
    }, 500);
  }
}, 100);

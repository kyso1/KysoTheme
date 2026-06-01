/*
 * @name Kyso Theme v3.0
 * @author Kyso
 * @description Kyso Clean theme for League of Legends (Pengu Loader)
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
import ProfileSkinUnlocker from "./profileskinunlocker.js";
import HideFriends from "./hidefriends.js";
import AutoAccept from "./autoaccept.js";
import "./main-theme/theme.css";
import { initSettingsPage } from "./settingsPage.js";
// import { initializeDodgeButton } from './dodgeButton.js';

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
  const bodyObserver = new MutationObserver(() => {
    const btn = document.querySelector(".action-bar-button.hide-button");
    if (btn) attachToButton(btn);
  });
  bodyObserver.observe(document.body, { childList: true, subtree: true });

  // Tenta imediatamente caso o botão já exista
  const existing = document.querySelector(".action-bar-button.hide-button");
  if (existing) attachToButton(existing);
}

window.addEventListener("load", () => {
  // Inicializa a página de configurações do tema (aplica settings salvas + observa DOM)
  initSettingsPage();

  if (window.MTZ) {
    new ProfileSkinUnlocker();
    new HideFriends();
    new AutoAccept();
  } else {
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
  const BLUR_TARGETS = [
    ".lol-social-sidebar",
    "lol-uikit-navigation-bar",
    ".rcp-fe-lol-uikit-frame",
    ".lol-social-lower-pane-container",
    ".lol-social-roster",
    ".parties-view",
    ".parties-view .parties-content",
    ".parties-content",
  ];

  const scrub = () => {
    for (const sel of BLUR_TARGETS) {
      document.querySelectorAll(sel).forEach((el) => {
        el.style.setProperty("backdrop-filter", "none", "important");
        el.style.setProperty("-webkit-backdrop-filter", "none", "important");
        // Não toca em filter geral (drop-shadow etc.), só se for blur
        const cur = getComputedStyle(el).filter;
        if (cur && cur.includes("blur")) {
          el.style.setProperty("filter", "none", "important");
        }
      });
    }
  };

  scrub();
  new MutationObserver(scrub).observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["style", "class"],
  });
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
  observer = new MutationObserver((mutations) => {
    if (addHomeButton()) {
      observer.disconnect();
      if (homeButtonInterval) {
        clearInterval(homeButtonInterval);
        homeButtonInterval = null;
      }
    }
  });

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

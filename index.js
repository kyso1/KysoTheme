/*
* @name Kyso Theme v2.1
* @author Kyso
* @description Kyso Clean theme for League of Legends (Pengu Loader)
* @link https://github.com/kyso1/KysoTheme
*/

import { githubIconBase64, resetIconBase64, folderIconBase64, previousBase64 } from './utils.js';
import { loadBackgroundImages, changeBackground, nextBackground, previousBackground, backgroundImages, currentBackgroundIndex } from './backgroundSelector.js';
import './main-theme/theme.css';

function addHomeButton() {
    let activityCenterTabs = document.querySelector("#activity-center .activity-center__tabs");
    
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
        
        // Create the button container to my own buttons
        let kysoButtonContainer = document.createElement("div");
        kysoButtonContainer.className = "kyso-Button-Container";
        
        let githubButton = createButton(
            "github-button",
            githubIconBase64,
            "GitHub",
            () => window.open("https://github.com/kyso1", "_blank")
        );
        
        let resetButton = createButton(
            "reset-button",
            resetIconBase64,
            "Reset",
            () => location.reload()
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
            }
        );

        let previousButton = createButton(
            "previous-button",
            previousBase64,
            "Previous",
            () => previousBackground()
        );

        let nextButton = createButton(
            "next-button",
            previousBase64,
            "Next",
            () => nextBackground()
        );
        
        kysoButtonContainer.appendChild(githubButton);
        kysoButtonContainer.appendChild(resetButton);
        kysoButtonContainer.appendChild(openFolderButton);
        // kysoButtonContainer.appendChild(previousButton);
        // kysoButtonContainer.appendChild(nextButton);
        
        contentContainer.appendChild(kysoButtonContainer);
        
        loadBackgroundImages().then(() => {
            if (backgroundImages.length > 0) {
                changeBackground(backgroundImages[currentBackgroundIndex]);
            }
        });
        
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
        subtree: true
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



function observeCrestProfileIconUrl() {
    if (setCrestProfileIconUrl()) return;
    const crestObserver = new MutationObserver(() => {
        if (setCrestProfileIconUrl()) {
            crestObserver.disconnect();
        }
    });
    crestObserver.observe(document.body, { childList: true, subtree: true });
}

document.addEventListener("DOMContentLoaded", () => {
    observeCrestProfileIconUrl();
});


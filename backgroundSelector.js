let backgroundImages = [];
let currentBackgroundIndex = 0;

async function loadBackgroundImages() {
    try {
        backgroundImages = [
            "./assets/Main/background1.jpg",
            "./assets/Main/background2.jpg",
            "./assets/Main/background.jpg"
        ];

        console.log("Background images loaded:", backgroundImages);
    } catch (error) {
        console.error("Failed to load background images:", error);
    }
}

function changeBackground(imagePath) {
    let contentContainer = document.querySelector("#rcp-fe-viewport-root");
    if (contentContainer) {
        contentContainer.style.backgroundImage = `url('${imagePath}')`;
        contentContainer.style.backgroundSize = "cover";
        contentContainer.style.backgroundPosition = "center";
        console.log(`Background changed to: ${imagePath}`);
    } else {
        console.error("Content container not found!");
    }
}

function nextBackground() {
    if (backgroundImages.length > 0) {
        currentBackgroundIndex = (currentBackgroundIndex + 1) % backgroundImages.length;
        changeBackground(backgroundImages[currentBackgroundIndex]);
    }
}

function previousBackground() {
    if (backgroundImages.length > 0) {
        currentBackgroundIndex = (currentBackgroundIndex - 1 + backgroundImages.length) % backgroundImages.length;
        changeBackground(backgroundImages[currentBackgroundIndex]);
    }
}

export { loadBackgroundImages, changeBackground, nextBackground, previousBackground, backgroundImages, currentBackgroundIndex };

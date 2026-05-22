const version = "1.2.1"
import utils from '_utils'

async function exitClient() {
    await fetch("/process-control/v1/process/quit", { method: "POST" });
}

window.exitClient = exitClient;

async function dodgeQueue() {
    await fetch("/lol-login/v1/session/invoke?destination=lcdsServiceProxy&method=call&args=[\"\",\"teambuilder-draft\",\"quitV2\",\"\"]",
        { body: "[\"\",\"teambuilder-draft\",\"quitV2\",\"\"]", method: "POST" });
}

window.dodgeQueue = dodgeQueue;

function generateDodgeAndExitButton(siblingDiv) {
    const div = document.createElement("div");
    const parentDiv = document.createElement("div");
    const placeHolderDiv = document.createElement("div");

    parentDiv.className = "dodge-button-container";
    parentDiv.style = "position: absolute; right: 10px; bottom: 57px; display: flex; align-items: flex-end;";

    div.className = "quit-button ember-view";
    div.id = "dodgeButton";
    div.onclick = window.dodgeQueue;

    placeHolderDiv.className = "quit-button ember-view";
    placeHolderDiv.id = "exitButton";
    placeHolderDiv.onclick = window.exitClient;

    const buttonPlaceHolder = document.createElement("lol-uikit-flat-button");
    const button = document.createElement("lol-uikit-flat-button");
    button.innerHTML = "Dodge";
    buttonPlaceHolder.innerHTML = "Exit";

    div.appendChild(button);
    placeHolderDiv.appendChild(buttonPlaceHolder);

    parentDiv.appendChild(div);
    parentDiv.appendChild(placeHolderDiv);

    siblingDiv.parentNode.insertBefore(parentDiv, siblingDiv);
}

let addDodgeAndExitButtonObserver = (mutations) => {
    if (utils.phase == "ChampSelect" && document.querySelector(".bottom-right-buttons") && !document.querySelector(".dodge-button-container")) {
        generateDodgeAndExitButton(document.querySelector(".bottom-right-buttons"));
    }
}

export function initializeDodgeButton() {
        utils.routineAddCallback(addDodgeAndExitButtonObserver, ["bottom-right-buttons"]);
        utils.addCss("utilsCss/DodgeButton.css");
}

let toggleBot = document.getElementById("toggleBot");
let model = document.getElementById("model").value
let valueApiKey = document.getElementById("apiKey").value;
let props = document.getElementById("props").value;
let responseSize = document.getElementById("responseSize").value;
let delayedResponse = document.getElementById("delayedResponse").value;
let botIsRunning = false


chrome.runtime.sendMessage({ action: "checkBotStatus" }, function (response) {
    updateToggleButton(response.botIsRunning);
});

toggleBot.addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "toggleBot", model, valueApiKey, props, responseSize, delayedResponse }, function (response) {
        updateToggleButton(response.botIsRunning);
    });
});

const updateToggleButton = (botIsRunning) => {
    if (botIsRunning) {
        toggleBot.innerText = "STOP";
        toggleBot.style.background = "red"
    } else {
        toggleBot.innerText = "START";
        toggleBot.style.background = "rgb(69, 187, 69)"
    }
}

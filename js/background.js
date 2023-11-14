// background.js

let botIsRunning = false;
let observer = null;
let currentTabId;

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "checkBotStatus") {
      sendResponse({ botIsRunning: botIsRunning });
  } else if (request.action === "toggleBot") {
    if (botIsRunning) {
      botIsRunning = false
      sendResponse({ botIsRunning: botIsRunning });
      stopBot();
    } else {
      botIsRunning = true
      sendResponse({ botIsRunning: botIsRunning });
      startBot(request.valueApiKey, request.props, request.delayedResponse, request.model, request.responseSize);
    }
  }
});

const stopBot = () => {
  if (currentTabId) {
      chrome.scripting.executeScript({
          target: { tabId: currentTabId },
          function: stopBotFunction,
      });
      currentTabId = undefined;
  }
};

const stopBotFunction = () => {
  if (observer) {
      observer.disconnect();
      console.log('[Chrome Extention] IMVU Bot: Stopped')
  }
};

const startBot = (valueApiKey, props, delayedResponse, model, responseSize) => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        currentTabId = tabs[0].id;
        chrome.scripting.executeScript({
            target: { tabId: currentTabId },
            function: startBotFunction,
            args: [valueApiKey, props, delayedResponse, model, responseSize],
        });
    });
};

const startBotFunction = (valueApiKey, props, delayedResponse, model, responseSize) => {
    console.log('[Chrome Extention] IMVU Bot: Started')
    let debounceTimeout = null;
    let isFetching = false;
    let history = []
    
    let messageListWrapper = document.querySelector('.message-list-wrapper');

    // Delete is-presenter class for undetecting old messages
    let foundMessages = messageListWrapper.querySelectorAll('.is-presenter');
    foundMessages.forEach(element => {
        element.classList.remove('is-presenter');
    });

    
    const parseMessagesFromChat = ( messageListWrapper, selector ) => {
        let presenterElements = messageListWrapper.querySelectorAll(selector);
    
        let messagesArray = [];
    
        presenterElements.forEach((presenterElement) => {
            let nameElement = presenterElement.querySelector('.cs2-name');
            let textElement = presenterElement.querySelector('.cs2-text');
    
            let name = nameElement ? nameElement.textContent.trim() : '';
            let message = textElement ? textElement.textContent.trim() : '';
    
            messagesArray.push({ name, message, role: 'user', answered: false });
        });
    
        return messagesArray
    }
        
    const sendMessageInChat = ( message ) => {
        let inputTextElement = document.querySelector('.input-text');
        let sendButtonElement = document.querySelector('.btn-send');
        if (inputTextElement && sendButtonElement) { 
            inputTextElement.focus();
            inputTextElement.value = message;
            sendButtonElement.removeAttribute('disabled');
            let clickEvent = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            sendButtonElement.dispatchEvent(clickEvent);
        }
    }
  
    const fetchOpenAiBot = async (valueApiKey, props, history) => {
        if (isFetching) {
            console.log("[Chrome Extention] IMVU Bot: Request is already pending. Skipping...");
            return;
        }

        isFetching = true;

        fetch("https://api.openai.com/v1/chat/completions", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${valueApiKey}`,
            },
            body: JSON.stringify({
                model: model,
                messages: [
                    { role: "system", content: props },
                    ...history.map((item) => ({role: item.role, content: item.role === 'user' ? `${item.name}: ${item.message}` : item.message}))
                ],
                max_tokens: Number(responseSize),
            })})
            .then(response => response.json())
            .then(data => data.choices[0].message.content.trim())
            .then(message => {
                history.push({name: 'Bot', role: 'assistant', message: message, timestamp: Date.now()})
                sendMessageInChat(`BOT: ${message}`)
                isFetching = false;
            })
            .catch(error => {
                isFetching = false;
                console.error('[Chrome Extention] IMVU Bot: Error fetching OpenAI API:', error)
            });
    }

    observer = new MutationObserver(() => {
        console.log('[Chrome Extention] IMVU Bot: Trigger observer')

        if (debounceTimeout || isFetching) {
            console.log('[Chrome Extention] IMVU Bot: Debounce. Skipping...');
            return;
        }

        clearTimeout(debounceTimeout);

        debounceTimeout = setTimeout(() => {
            let messagesFromChat = parseMessagesFromChat(messageListWrapper, '.is-presenter:not(.my-user)')
            if (messagesFromChat.length > 0) {
                const newMessages = messagesFromChat.filter(
                    msg => !history.some(existingMsg => existingMsg.message === msg.message)
                );
    
                if (newMessages.length > 0) {
                    newMessages.forEach(msg => {
                        msg.timestamp = Date.now();
                        history.push(msg);
                    });
                    
                    fetchOpenAiBot(valueApiKey, props, history)
                }
            }
            debounceTimeout = null;
        }, Number(delayedResponse + '000')); 
    });

    let config = { subtree: true, childList: true };

    observer.observe(messageListWrapper, config);
};

chrome.tabs.onRemoved.addListener(function (tabId) {
  if (tabId === currentTabId) {
      stopBot();
      botIsRunning = false;
  }
});
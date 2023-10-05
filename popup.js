function sendContent(message, withResponse = false) {
    return new Promise((resolve, reject) => {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            if (withResponse) {
                chrome.tabs.sendMessage(tabs[0].id, message, function (response) {
                    // response dari content
                    if (chrome.runtime.lastError) {
                        resolve({ failed: true, error: chrome.runtime.lastError.message })
                        // return undefined;
                    }
                    // IF NOT ERROR SEND FALSE to err PARAMS  
                    resolve(response)
                });
            } else {
                resolve("send without response success!")
                chrome.tabs.sendMessage(tabs[0].id, message)
            }
        });
    })
}

function sendBackground(message, withResponse = false) {
    return new Promise(function (resolve, reject) {
        if (withResponse) {
            chrome.runtime.sendMessage(message, function (response) {
                const error = chrome.runtime.lastError;
                if (error) {
                    resolve({ failed: true, error: error.message })
                }
                resolve(response)
            })
        } else {
            resolve("send message with no response success!")
            chrome.runtime.sendMessage(message)
        }

    })
}

document.addEventListener("DOMContentLoaded", function () {
    let send = document.querySelector('.send');
    send.onclick = async function () {
        // const background = sendBackground({ from: "popup", data: "Hello background, from popup!" })
        // console.log("content",background);
        const content = await sendContent({ from: "popup", data: "Hello content, from popup!" }, false)
        console.log("content says to popup:", content);
    }
})

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    console.log("message for popup:", message);
    // if (message.action === "myAction") {
    //   console.log("Pesan diterima dari popup:", message.data);
    // }
});
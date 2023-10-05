// Wrap in an onInstalled callback in order to avoid unnecessary work
// every time the background script is run
chrome.runtime.onInstalled.addListener(() => {
    // Page actions are disabled by default and enabled on select tabs
    chrome.action.disable();

    // Clear all rules to ensure only our expected rules are set
    chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
        // Declare a rule to enable the action on example.com pages
        let exampleRule = {
            conditions: [
                new chrome.declarativeContent.PageStateMatcher({
                    pageUrl: { hostSuffix: 'google.com' },
                })
            ],
            actions: [new chrome.declarativeContent.ShowAction()],
        };

        // Finally, apply our new array of rules
        let rules = [exampleRule];
        chrome.declarativeContent.onPageChanged.addRules(rules);
    });
});


const cl = console.log,
msgError = e => console.log("%c" + e, "color:#ff0055; font-size:14px;");

async function logs() {
    return console.log("maniaccc")
}

chrome.tabs.onUpdated.addListener(async function (tabId, changeInfo, tab) {
    if (!tab.url.includes("google.com")) return;
    if (changeInfo.status === "complete" && tab.status === "complete") {
        // cl("tabId:", tabId)
        // cl("changeInfo:", changeInfo)
        // cl("tab:", tab)
        // EXECUTE THE content.js IF NOT EXECUTED
        sendContent({loaded: true}, function(response){
            if(response.failed) {
                chrome.scripting.executeScript({
                    target: { tabId: tabId},
                    files: ['content.js'],
                })
            }
        })
    }else{
        return undefined;
    }



})

chrome.webNavigation.onCompleted.addListener(function(tabs){
    if(tabs.frameType !== "outermost_frame") return false;
    if(!tabs.url.includes('google.com')) return false;
    cl(tabs);
    
    // console.log("web on completed", tabs);

    setTimeout(async function(){
        const result = await getContent({from: "background", data: "hello from background!"})
        cl("result", result);
    }, 500)

})


function sendContent(message, callback) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage( tabs[0].id, message, function (response) {
            // Tanggapan dari background script
            if(chrome.runtime.lastError) {
                callback({failed: true, error: chrome.runtime.lastError.message})
                return undefined;
            }
            // IF NOT ERROR SEND FALSE to err PARAMS  
            callback(response)
        });
    });
}

function getContent(message) {
    return new Promise((resolve, reject) => {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage( tabs[0].id, message, function (response) {
                // Tanggapan dari background script
                if(chrome.runtime.lastError) {
                    resolve({failed: true, error: chrome.runtime.lastError.message})
                    // return undefined;
                }
                // IF NOT ERROR SEND FALSE to err PARAMS  
                resolve(response)
            });
        });
    })
}

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    
    if(message.from === "content") {
        // cl("message for background:", message);
    }
    if(message.from === "popup") {
        // sendResponse({from: "background", data: "background accept popup message"})
    }
    // if (message.action === "myAction") {
    //   console.log("Pesan diterima dari popup:", message.data);
    // }
});




/*
// UNTUK AUTO KLIK LINK GUNAKAN INI
let click = new InputEvent("click", {
    bubbles: true,
    cancelable: true,
    view: window
})

let phone = 8329477745
let text = `halo
apa kabar`
let url = 'https://api.whatsapp.com/send?phone=' + phone + '&text=' + encodeURIComponent(text)

const wasend = document.createElement('a')
wasend.id = 'wa-send'
wasend.textContent = "WA-SEND"
wasend.href = url;

if(document.getElementById('wa-send')) {
    document.getElementById('wa-send').remove();
    document.body.appendChild(wasend);
}else{
    document.body.appendChild(wasend);
}

// document.getElementById('wa-send').focus()
wasend.dispatchEvent(click)


// auto click div whatsapp contact
let click = new MouseEvent("mousedown", {
    bubbles: true,
    cancelable: true,
    view: window
})

let bt = document.querySelector(".lhggkp7q.ln8gz9je.rx9719la ._13jwn")

bt.focus()
bt.dispatchEvent(click)
*/
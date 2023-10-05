console.log("landing the content")

const stackMessage = [];

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if(message.loaded) {
        console.log("Get Background Message");
        sendResponse("content is loaded")
        // console.log("content is loaded");
    }
    if(message.from === "background") {
        // console.log("message from:", message);
        sendResponse({from: "content", body: "background message accpeted!"})
    }
    if (message.from === "popup") {
        stackMessage.push(message)
        // console.log("message from:", message);
        // console.log();
        sendResponse({from: "content", body: "popup message accpeted!"})
    }

});

function randomNumber() {
    return Math.floor(Math.random() * 999999999)
}

let interval = setInterval(() => {
    if(stackMessage.length > 0) {
        console.log(stackMessage[0])
            chrome.runtime.sendMessage(tabs[0].id, { from: "content", body: {phone: randomNumber(), message: "send number success!"} });
        stackMessage.splice(0, 1)
    }else{
        console.log("stackMessage DONE!")
    }
}, 1000);
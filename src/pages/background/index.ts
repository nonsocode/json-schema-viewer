import reloadOnUpdate from "virtual:reload-on-update-in-background-script";

reloadOnUpdate("pages/background");

/**
 * Extension reloading is necessary because the browser automatically caches the css.
 * If you do not use the css of the content script, please delete it.
 */
reloadOnUpdate("pages/content");

chrome.runtime.onMessage.addListener((message, sender) => {
  if (message.type === "inject-app") {
    chrome.scripting.executeScript({
      target: { tabId: sender.tab.id },
      files: ["src/pages/root/index.js"]
    }).then(() => {
      chrome.tabs.sendMessage(sender.tab.id, { type: "start-app" });
    });
  }
});

function isJsonDocument() {
  if (document.contentType === "application/json") return true;
  if (document.contentType === "application/vnd.api+json") return true;
  if (document.contentType === "application/schema+json") return true;
  if (document.contentType === "application/ld+json") return true;
  if (
    document.contentType === "text/plain" &&
    document.body.querySelector(":scope > pre")
  )
    return true;
}
import("./update");
isJsonDocument() &&
  // For secure contexts, we can't import the app directly
  // so we need to signal the background script to inject the app
  // into the page
  chrome.runtime.sendMessage({ type: "inject-app" });

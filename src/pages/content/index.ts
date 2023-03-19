function isJsonDocument() {
  return document.contentType === "application/json";
}

isJsonDocument() && import("./components/root")
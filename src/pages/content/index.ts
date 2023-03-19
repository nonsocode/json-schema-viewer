
function isJsonDocument() {
  return document.contentType === "application/json";
}
import('./update')
isJsonDocument() &&
  import("./components/root").then(({ createApp }) => createApp());

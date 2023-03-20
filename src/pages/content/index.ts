
function isJsonDocument() {
  if (document.contentType === "application/json") return true;
  if (document.contentType === "application/vnd.api+json") return true;
  if (document.contentType === "application/schema+json") return true;
  if (document.contentType === "application/ld+json") return true;
  if (document.contentType === "text/plain" && document.body.querySelector(":scope > pre")) return true;
}
import('./update')
isJsonDocument() &&
  import("./components/root").then(({ createApp }) => createApp());

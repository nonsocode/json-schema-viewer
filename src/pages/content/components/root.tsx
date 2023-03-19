import { createRoot } from "react-dom/client";
import App from "@src/pages/content/components/app";

export function createApp() {
  const root = document.createElement("json-view-root");
  const defaultPre: HTMLPreElement = document.querySelector("body > pre");
  defaultPre.style.display = "none";
  document.body.append(root);

  createRoot(root).render(<App jsonString={defaultPre.textContent} />);
}

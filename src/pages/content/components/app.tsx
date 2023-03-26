import { Entry } from "./entry";
import classnames from "classnames/bind";
import styles from "./app.module.css";
import { ROOT_IDENTIFIER } from "../constants";
import { jsonTreeCache } from "../cache";
import { UrlProvider } from "../context/url";
import { JsonValue } from "@src/types";
const cx = classnames.bind(styles);
import { onMount } from "solid-js";
interface AppProps {
  jsonString: string;
}

export default function App({ jsonString }: AppProps) {
  const tree = JSON.parse(jsonString) as JsonValue;

  jsonTreeCache.set(getCurrentUrl(), tree);
  jsonTreeCache.set("", tree);

  onMount(() => {
    (document.scrollingElement as HTMLElement).style.scrollBehavior = "smooth";
    if (document.location.hash) {
      const el = document.getElementById(document.location.hash.slice(1));
      if (el) {
        el.scrollIntoView();
      }
    }
  });

  return (
    <UrlProvider>
      <div class={cx("json-view-app")}>
        <Entry parentPath="" value={tree} isLast identifier={ROOT_IDENTIFIER} ref={() => {}} />
      </div>
    </UrlProvider>
  );
}

function getCurrentUrl() {
  const url = new URL(window.location.href);
  return url.origin + url.pathname;
}

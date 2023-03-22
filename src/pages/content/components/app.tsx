import { useEffect, useMemo } from "react";
import { Entry } from "./entry";
import classnames from "classnames/bind";
import styles from "./app.module.css";
import { ROOT_IDENTIFIER } from "../constants";
import { jsonTreeCache } from "../store";
import { UrlProvider } from "../context/url";
import { JsonValue } from "@src/types";
const cx = classnames.bind(styles);
interface AppProps {
  jsonString: string;
}

export default function App({ jsonString }: AppProps) {
  const tree = useMemo(() => {
    const startTime = performance.now()
    console.time('processing')
    try {
      const res = JSON.parse(jsonString) as JsonValue;
      return res;
    } catch (e) {
      console.error(e);
    }
    finally {
      console.timeEnd('processing')
    }
  }, [jsonString]);

  useEffect(() => {
    jsonTreeCache.set(getCurrentUrl(), tree);
    jsonTreeCache.set("", tree);
  }, [tree]);

  useEffect(() => {
    (document.scrollingElement as HTMLElement).style.scrollBehavior = 'smooth'
    if(document.location.hash) {
      const el = document.getElementById(document.location.hash.slice(1))
      if(el) {
        el.scrollIntoView()
      }
    }
  }, [])

  return (
    <UrlProvider>
      <div className={cx("json-view-app")}>
        <Entry
          parentPath=""
          value={tree}
          isLast
          identifier={ROOT_IDENTIFIER}
        />
      </div>
    </UrlProvider>
  );
}

function getCurrentUrl() {
  const url = new URL(window.location.href);
  return url.origin + url.pathname;
}

import { useEffect, useMemo } from "react";
import { Entry } from "./entry";
import classnames from "classnames/bind";
import styles from "./app.module.css";
import { ROOT_IDENTIFIER } from "../constants";
import { jsonTreeStore } from "../store";
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
    jsonTreeStore.set(getCurrentUrl(), tree);
    jsonTreeStore.set("", tree);
  }, [tree]);

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

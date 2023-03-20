import { useEffect, useMemo } from "react";
import jta from "json-to-ast";
import { Entry } from "./entry";
import classnames from "classnames/bind";
import styles from "./app.module.css";
import { ROOT_IDENTIFIER } from "../constants";
import { astStore } from "../store";
import { UrlProvider } from "../context/url";
const cx = classnames.bind(styles);
interface AppProps {
  jsonString: string;
}

export default function App({ jsonString }: AppProps) {
  const tree = useMemo(() => {
    console.time();
    const res = jta(jsonString, {
      loc: false,
    });
    console.timeEnd();
    return res;
  }, [jsonString]);

  useEffect(() => {
    astStore.set(getCurrentUrl(), tree);
    astStore.set("", tree);
  }, []);

  return (
    <UrlProvider>
      <div className={cx("json-view-app")}>
        <Entry
          parentPath=""
          root={tree}
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

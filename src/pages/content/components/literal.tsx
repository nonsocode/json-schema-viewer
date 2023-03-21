import classnames from "classnames/bind";
import styles from "./literal.module.css";
import { LiteralNode } from "json-to-ast";
import { isUrl } from "@src/utils/url";
import { useContext, useMemo } from "react";
import { UrlContext } from "../context/url";
import { Literal, LiteralComponentProps } from "@src/types";
import { getJsonType } from "@src/utils/json";
const cx = classnames.bind(styles);

export function LiteralComponent(props: LiteralComponentProps) {
  switch (getJsonType(props.node)) {
    case "number":
      return <span className={cx("number-value")}>{props.node}</span>;
    case "string":
      return <StringComponent node={props.node as string} />;
    case "boolean":
      return (
        <span className={cx("boolean-value")}>
          {props.node ? "true" : "false"}
        </span>
      );
    case "null":
      return <span className={cx("null-value")}>null</span>;
    default:
      return <span className={cx("undefined-value")}>undefined</span>;
  }
}
type StringComponentProps = {
  node: string;
};
function StringComponent(props: StringComponentProps) {
  const urlContext = useContext(UrlContext);
  const url = useMemo(() => {
    if (!isUrl(props.node)) return null;
    let url: URL;
    const partialUrl = props.node;
    if (partialUrl.startsWith("#")) {
      url = new URL(urlContext.fullPath);
      url.hash = partialUrl;
    } else {
      url = new URL(partialUrl);
    }
    return url;
  }, [urlContext.fullPath, props.node]);

  return url ? (
    <a href={url.toString()} className={cx("url-value")}>
      "{props.node}"
    </a>
  ) : (
    <span className={cx("string-value")}>"{props.node}"</span>
  );
}

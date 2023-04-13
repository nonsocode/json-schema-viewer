import classnames from "classnames/bind";
import styles from "./literal.module.css";
import { isUrl } from "@src/utils/url";
import { memo, useContext, useMemo } from "react";
import { UrlContext } from "../context/url";
import { LiteralComponentProps } from "@src/types";
import { getJsonType } from "@src/utils/json";
const cx = classnames.bind(styles);

export const LiteralComponent = memo(function LiteralComponent(
  props: LiteralComponentProps
) {
  let data;
  switch (getJsonType(props.node)) {
    case "number":
      data = <span className={cx("number-value")}>{props.node}</span>;
      break;
    case "string":
      data = <StringComponent node={props.node as string} />;
      break;
    case "boolean":
      data = (
        <span className={cx("boolean-value")}>
          {props.node ? "true" : "false"}
        </span>
      );
      break;
    case "null":
      data = <span className={cx("null-value")}>null</span>;
      break;
    default:
      data = <span className={cx("undefined-value")}>undefined</span>;
  }
  return (
    <>
      {data}
      {props.isLast ? "" : ","}
    </>
  );
});
type StringComponentProps = {
  node: string;
};
function StringComponent(props: StringComponentProps) {
  const urlContext = useContext(UrlContext);
  const url = useMemo(() => {
    if (!isUrl(props.node)) return null;
    let url: URL = null;
    const partialUrl = props.node;
    try {
      if (partialUrl.startsWith("#")) {
        url = new URL(urlContext.fullPath);
        url.hash = partialUrl;
      } else {
        url = new URL(partialUrl);
      }
    } catch (e) {}
    return url;
  }, [urlContext.fullPath, props.node]);

  return url ? (
    <a href={url.toString()} className={cx("url-value")}>
      "{props.node}"
    </a>
  ) : (
    <span className={cx("string-value")}>
      "{props.node.replaceAll('"', '\\"')}"
    </span>
  );
}

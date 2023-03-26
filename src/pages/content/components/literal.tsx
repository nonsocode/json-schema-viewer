import classnames from "classnames/bind";
import styles from "./literal.module.css";
import { isUrl } from "@src/utils/url";
import { UrlContext } from "../context/url";
import { LiteralComponentProps } from "@src/types";
import { getJsonType } from "@src/utils/json";
import { createMemo, useContext } from "solid-js";
const cx = classnames.bind(styles);

export const LiteralComponent = function LiteralComponent(
  props: LiteralComponentProps
) {
  let data;
  switch (getJsonType(props.node)) {
    case "number":
      data = <span class={cx("number-value")}>{props.node}</span>;
      break;
    case "string":
      data = <StringComponent node={props.node as string} />;
      break;
    case "boolean":
      data = (
        <span class={cx("boolean-value")}>
          {props.node ? "true" : "false"}
        </span>
      );
      break;
    case "null":
      data = <span class={cx("null-value")}>null</span>;
      break;
    default:
      data = <span class={cx("undefined-value")}>undefined</span>;
  }
  return (
    <>
      {data}
      {props.isLast ? "" : ","}
    </>
  );
};
type StringComponentProps = {
  node: string;
};
function StringComponent(props: StringComponentProps) {
  const urlContext = useContext(UrlContext);
  const url = createMemo(() => {
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
  });

  return url() ? (
    <a href={url().toString()} class={cx("url-value")}>
      "{props.node}"
    </a>
  ) : (
    <span class={cx("string-value")}>"{props.node}"</span>
  );
}

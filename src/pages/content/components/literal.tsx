import { CommonValueProps } from "../types";
import classnames from "classnames/bind";
import styles from "./literal.module.css";
import { LiteralNode } from "json-to-ast";
import { isUrl } from "@src/utils/url";
import { useContext, useMemo } from "react";
import { UrlContext } from "../context/url";
const cx = classnames.bind(styles);

type LiteralComponentProps = CommonValueProps & {
  node: jsonToAst.LiteralNode;
};
export function LiteralComponent(props: LiteralComponentProps) {
  switch (true) {
    case typeof props.node.value === "number":
      return <span className={cx("number-value")}>{props.node.raw}</span>;
    case typeof props.node.value === "string":
      return <StringComponent node={props.node} />;
    case typeof props.node.value === "boolean":
      return <span className={cx("boolean-value")}>{props.node.raw}</span>;
    case props.node.value === null:
      return <span className={cx("null-value")}>{props.node.raw}</span>;
    default:
      return <span className={cx("undefined-value")}>{props.node.raw}</span>;
  }
}
type StringComponentProps = {
  node: LiteralNode;
};
function StringComponent(props: StringComponentProps) {
  const urlContext = useContext(UrlContext);
  const url = useMemo(() => {
    if (!isUrl(props.node.value as string)) return null;
    let url: URL;
    const partialUrl = props.node.value as string;
    if (partialUrl.startsWith("#")) {
      url = new URL(urlContext.fullPath);
      url.hash = partialUrl;
    } else {
      url = new URL(partialUrl);
    }
    return url;
  }, [urlContext.fullPath, props.node.value]);
  
  return url ? (
    <a href={url.toString()} className={cx("url-value")}>
      {props.node.raw}
    </a>
  ) : (
    <span className={cx("string-value")}>{props.node.raw}</span>
  );
}

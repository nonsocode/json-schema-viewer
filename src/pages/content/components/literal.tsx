import { CommonValueProps } from "../types";
import classnames from "classnames/bind";
import styles from "./literal.module.css";
import { LiteralNode } from "json-to-ast";
import { isUrl } from "@src/utils/json/url";
const cx = classnames.bind(styles);

type LiteralComponentProps = CommonValueProps & {
  node: jsonToAst.LiteralNode;
};
export function LiteralComponent(props: LiteralComponentProps) {
  switch (true) {
    case typeof props.node.value === "number":
      return <span className={cx("number-value")}>{props.node.raw}</span>;
    case typeof props.node.value === "string":
      return getStringElement(props.node);
    case typeof props.node.value === "boolean":
      return <span className={cx("boolean-value")}>{props.node.raw}</span>;
    case props.node.value === null:
      return <span className={cx("null-value")}>{props.node.raw}</span>;
    default:
      return <span className={cx("undefined-value")}>{props.node.raw}</span>;
  }
}

function getStringElement(node: LiteralNode) {
  if (isUrl(node.value as string)) {
    return (
      <a href={node.value as string} className={cx("url-value")}>
        {node.raw}
      </a>
    );
  }
  return <span className={cx("string-value")}>{node.raw}</span>;
}

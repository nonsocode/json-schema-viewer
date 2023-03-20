import { CommonValueProps } from "../types";
import { Entry } from "./entry";
import classnames from "classnames/bind";
import styles from "./array.module.css";
import { useMemo } from "react";
const cx = classnames.bind(styles);

type ArrayComponentProps = CommonValueProps & {
  node: jsonToAst.ArrayNode;
  parentPath: string;
};
export function ArrayComponent(props: ArrayComponentProps) {
  return (
    <>
      <ArrayOpener />
      <div className={cx("array-block")}>
        {props.node.children.map((prop, index) => (
          <ArrayEntry
            key={index}
            root={props.root}
            value={prop}
            index={index}
            parentPath={props.parentPath}
            isLast={index === props.node.children.length - 1}
          />
        ))}
      </div>
      <ArrayCloser />
    </>
  );
}
type ArrayEntryProps = {
  root: jsonToAst.ValueNode;
  value: jsonToAst.ValueNode;
  index: number;
  isLast: boolean;
  parentPath: string;
};
function ArrayEntry(props: ArrayEntryProps) {
  const identifier: jsonToAst.IdentifierNode = useMemo(
    () => ({
      type: "Identifier",
      value: props.index.toString(),
      raw: props.index.toString(),
    }),
    [props.index]
  );
  return (
    <Entry
      root={props.root}
      value={props.value}
      identifier={identifier}
      isLast={props.isLast}
      parentPath={props.parentPath}
    />
  );
}

export function ArrayOpener() {
  return <span className={cx("array-opener")}>[</span>;
}
export function ArrayCloser() {
  return <span className={cx("array-closer")}>]</span>;
}

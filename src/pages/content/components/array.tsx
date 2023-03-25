import { Entry } from "./entry";
import classnames from "classnames/bind";
import styles from "./array.module.css";
import { ArrayComponentProps, CollapsibleRef } from "@src/types";
import { Summary } from "./summary";
import { Elipsis } from "./elipsis";
import { forwardRef, memo } from "react";
import { useCollapsibles } from "../hooks";
const cx = classnames.bind(styles);

export const ArrayComponent = memo(forwardRef<CollapsibleRef, ArrayComponentProps>(
  function ArrayComponent(props, ref) {
    const summary = `${props.node.length} item${
      props.node.length > 1 ? "s" : ""
    }`;

    const [, createEntryRef] = useCollapsibles(ref);
    return (
      <>
        <ArrayOpener />
        <div
          className={cx("array-block", {
            "array-block-hidden": !props.expanded,
          })}
        >
          {props.node.map((prop, index) => (
            <Entry
              key={index}
              value={prop}
              identifier={index}
              isLast={index === props.node.length - 1}
              parentPath={props.parentPath}
              ref={(ref) => createEntryRef(ref, index, prop)}
            />
          ))}
        </div>
        <Elipsis className={cx({ "array-block-hidden": props.expanded })} />
        <ArrayCloser />
        {props.isLast ? "" : ","}
        {!props.expanded && <Summary content={summary} />}
      </>
    );
  }
));

export function ArrayOpener() {
  return <span className={cx("array-opener")}>[</span>;
}
export function ArrayCloser() {
  return <span className={cx("array-closer")}>]</span>;
}

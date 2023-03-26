import { Entry } from "./entry";
import classnames from "classnames/bind";
import styles from "./array.module.css";
import { ArrayComponentProps, CollapsibleRef, PropsWithRef } from "@src/types";
import { Summary } from "./summary";
import { Elipsis } from "./elipsis";
import { useCollapsibles } from "../hooks";
import { For } from "solid-js";
const cx = classnames.bind(styles);

export const ArrayComponent = function ArrayComponent(props: PropsWithRef<ArrayComponentProps, CollapsibleRef>) {
  const summary = `${props.node.length} item${
    props.node.length > 1 ? "s" : ""
  }`;

  const  createEntryRef = useCollapsibles(props.ref);
  return (
    <>
      <ArrayOpener />
      <div
        class={cx("array-block", {
          "array-block-hidden": !props.expanded,
        })}
      >
        <For each={props.node}>
          {(prop, index) => (
            <Entry
              value={prop}
              identifier={index()}
              isLast={index() === props.node.length - 1}
              parentPath={props.parentPath}
              ref={createEntryRef}
            />
          )}
        </For>
      </div>
      <Elipsis className={cx({ "array-block-hidden": props.expanded })} />
      <ArrayCloser />
      {props.isLast ? "" : ","}
      {!props.expanded && <Summary content={summary} />}
    </>
  );
};

export function ArrayOpener() {
  return <span class={cx("array-opener")}>[</span>;
}
export function ArrayCloser() {
  return <span class={cx("array-closer")}>]</span>;
}

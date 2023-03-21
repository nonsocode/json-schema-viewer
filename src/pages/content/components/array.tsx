import { Entry } from "./entry";
import classnames from "classnames/bind";
import styles from "./array.module.css";
import { ArrayComponentProps, JsonValue } from "@src/types";
import { Summary } from "./summary";
import { Elipsis } from "./elipsis";
const cx = classnames.bind(styles);

export function ArrayComponent(props: ArrayComponentProps) {
  const summary = `${props.node.length} item${props.node.length > 1 ? "s" : ""}`
  return (
    <>
      <ArrayOpener />
      {props.expanded ? (
        <div className={cx("array-block")}>
          {props.node.map((prop, index) => (
            <ArrayEntry
              key={index}
              value={prop}
              index={index}
              parentPath={props.parentPath}
              isLast={index === props.node.length - 1}
            />
          ))}
        </div>
      ) : (
        <Elipsis />
      )}
      <ArrayCloser />
      {props.isLast ? "" : ","}
      {!props.expanded && <Summary content={summary} />}
    </>
  );
}
type ArrayEntryProps = {
  value: JsonValue;
  index: number;
  isLast: boolean;
  parentPath: string;
};
function ArrayEntry(props: ArrayEntryProps) {
  return (
    <Entry
      value={props.value}
      identifier={props.index}
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

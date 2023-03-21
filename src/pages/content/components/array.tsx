import { Entry } from "./entry";
import classnames from "classnames/bind";
import styles from "./array.module.css";
import { ArrayComponentProps, JsonValue } from "@src/types";
const cx = classnames.bind(styles);

export function ArrayComponent(props: ArrayComponentProps) {
  return (
    <>
      <ArrayOpener />
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
      <ArrayCloser />
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

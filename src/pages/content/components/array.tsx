import { CommonValueProps } from "../types";
import { Entry } from "./entry";
import classnames from "classnames/bind";
import styles from "./array.module.css";
const cx = classnames.bind(styles);

type ArrayComponentProps = CommonValueProps & {
  node: jsonToAst.ArrayNode;
};
export function ArrayComponent(props: ArrayComponentProps) {
  return (
    <div className={cx('array-block')}>
      {props.node.children.map((prop, index) => (
        <Entry
          key={index}
          root={props.root}
          value={prop}
          isLast={index === props.node.children.length - 1}
        />
      ))}
    </div>
  );
}

export function ArrayOpener() {
  return <span className={cx("array-opener")}>[</span>;
}
export function ArrayCloser() {
  return <span className={cx("array-closer")}>]</span>;
}

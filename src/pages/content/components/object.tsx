import { CommonValueProps } from "../types";
import classnames from "classnames/bind";
import style from "./object.module.css";
import { Entry } from "./entry";
const cx = classnames.bind(style);

type ObjectComponentProps = CommonValueProps & {
  node: jsonToAst.ObjectNode;
  parentPath: string
};
export function ObjectComponent(props: ObjectComponentProps) {
  return (
    <div className={cx('object-block')}>
      {props.node.children.map((prop, index) => (
        <Entry
          key={index}
          root={props.root}
          value={prop.value}
          parentPath={props.parentPath}
          identifier={prop.key}
          isLast={index === props.node.children.length - 1}
        />
      ))}
    </div>
  );
}

export function ObjectOpener() {
  return <span className={cx('object-opener')}>{'{'}</span>
}
export function ObjectCloser() {
  return <span className={cx('object-closer')}>{'}'}</span>
}
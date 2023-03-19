import { CommonValueProps } from "../types";
import { ArrayCloser, ArrayComponent, ArrayOpener } from "./array";
import { LiteralComponent } from "./literal";
import { ObjectComponent, ObjectOpener, ObjectCloser } from "./object";
import classnames from "classnames/bind";
import styles from "./entry.module.css";
const cx = classnames.bind(styles);

type EntryProps = CommonValueProps & {
  identifier?: jsonToAst.IdentifierNode;
  value: jsonToAst.ValueNode;
  isLast: boolean;
};
export function Entry(props: EntryProps) {
  return (
    <div className={cx("entry")}>
      {(props.value.type !== "Literal") && <ExpandButton />}
      {props.identifier && (
        <>
          <Identifier value={props.identifier.raw} />
          <KVSeparator />
        </>
      )}
      {props.value.type === "Object" && (
        <>
          <ObjectOpener />
          <ObjectComponent node={props.value} {...props} root={props.root} />
          <ObjectCloser />
        </>
      )}
      {props.value.type === "Array" && (
        <>
          <ArrayOpener />
          <ArrayComponent root={props.root} node={props.value} />
          <ArrayCloser />
        </>
      )}
      {props.value.type === "Literal" && (
        <LiteralComponent root={props.root} node={props.value} />
      )}
      {props.isLast ? "" : ","}
    </div>
  );
}

function KVSeparator() {
  return <span className={cx("kv-separator")}>:&nbsp;</span>;
}

function Identifier({ value }: { value: string }) {
  return <span className={cx("identifier")}>{value}</span>;
}


function ExpandButton() {
  return <button className={cx('expand-button')}></button>
}
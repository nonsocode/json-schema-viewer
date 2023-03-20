import { CommonValueProps } from "../types";
import { ArrayCloser, ArrayComponent, ArrayOpener } from "./array";
import { LiteralComponent } from "./literal";
import { ObjectComponent, ObjectOpener, ObjectCloser } from "./object";
import classnames from "classnames/bind";
import styles from "./entry.module.css";
import { ROOT_IDENTIFIER } from "../constants";
import { escape } from "@src/utils/json/pointer";
const cx = classnames.bind(styles);

type EntryProps = CommonValueProps & {
  identifier?: jsonToAst.IdentifierNode;
  value: jsonToAst.ValueNode;
  isLast: boolean;
  parentPath: string;
};
export function Entry(props: EntryProps) {
  return (
    <div className={cx("entry")}>
      {props.value.type !== "Literal" && <ExpandButton />}
      {props.identifier && (
        <>
          <Identifier
            identifier={props.identifier}
            parentPath={props.parentPath}
          />
          {props.identifier !== ROOT_IDENTIFIER && <KVSeparator />}
        </>
      )}
      {props.value.type === "Object" && (
        <>
          <ObjectOpener />
          <ObjectComponent
            node={props.value}
            {...props}
            root={props.root}
            parentPath={
              props.identifier === ROOT_IDENTIFIER
                ? ""
                : generateId(props.parentPath, props.identifier)
            }
          />
          <ObjectCloser />
        </>
      )}
      {props.value.type === "Array" && (
        <>
          <ArrayOpener />
          <ArrayComponent
            root={props.root}
            node={props.value}
            parentPath={
              props.identifier === ROOT_IDENTIFIER
                ? ""
                : generateId(props.parentPath, props.identifier)
            }
          />
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

function generateId(parentPath: string, identifier: jsonToAst.IdentifierNode) {
  return `${parentPath}/${escape(identifier.value)}`;
}

function KVSeparator() {
  return <span className={cx("kv-separator")}>:&nbsp;</span>;
}

type IdentifierProps = {
  identifier: jsonToAst.IdentifierNode;
  parentPath: string;
};
function Identifier({ identifier, parentPath }: IdentifierProps) {
  return (
    <span className={cx("identifier")} id={generateId(parentPath, identifier)}>
      {identifier.raw}
    </span>
  );
}

function ExpandButton() {
  return <button className={cx("expand-button")}></button>;
}

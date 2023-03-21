import { ArrayComponent } from "./array";
import { LiteralComponent } from "./literal";
import { ObjectComponent } from "./object";
import classnames from "classnames/bind";
import styles from "./entry.module.css";
import { ROOT_IDENTIFIER } from "../constants";
import { escape } from "@src/utils/json/pointer";
import {
  EntryProps,
  ExpandedButtonProps,
  Identifier as Identity,
  IdentifierProps,
  JsonArray,
  JsonObject,
  JsonValue,
  Literal,
} from "@src/types";
import { useCallback, useMemo, useState } from "react";
import { getJsonType, isLiteral } from "@src/utils/json";
const cx = classnames.bind(styles);

export function Entry(props: EntryProps) {
  const [expanded, setExpanded] = useState(true);
  const type = useMemo(() => {
    return getJsonType(props.value);
  }, [props.value]);
  const valueIsLiteral = useMemo(() => {
    return isLiteral(props.value);
  }, [props.value]);

  const showIdentifier = useMemo(() => {
    return (
      props.identifier !== undefined &&
      props.identifier !== ROOT_IDENTIFIER &&
      typeof props.identifier !== "number"
    );
  }, []);

  const handleExpand = useCallback(() => {
    setExpanded((prev) => !prev);
  }, []);
  return (
    <div className={cx("entry")}>
      {!valueIsLiteral && (
        <ExpandButton onClick={handleExpand} isExpanded={expanded} />
      )}
      {showIdentifier && (
        <>
          <Identifier
            identifier={props.identifier}
            parentPath={props.parentPath}
          />
          <KVSeparator />
        </>
      )}
      {type === "object" && (
        <ObjectComponent
          node={props.value as JsonObject}
          expanded={expanded}
          isLast={props.isLast}
          parentPath={
            props.identifier === ROOT_IDENTIFIER
              ? ""
              : generateId(props.parentPath, props.identifier)
          }
        />
      )}
      {type === "array" && (
        <ArrayComponent
          node={props.value as JsonArray}
          expanded={expanded}
          parentPath={
            props.identifier === ROOT_IDENTIFIER
              ? ""
              : generateId(props.parentPath, props.identifier)
          }
          isLast={props.isLast}
        />
      )}
      {valueIsLiteral && (
        <LiteralComponent node={props.value as Literal} isLast={props.isLast} />
      )}
    </div>
  );
}

function generateId(parentPath: string, identifier: Identity) {
  return `${parentPath}/${escape(identifier.toString())}`;
}

function KVSeparator() {
  return <span className={cx("kv-separator")}>:&nbsp;</span>;
}

function Identifier({ identifier, parentPath }: IdentifierProps) {
  return (
    <span className={cx("identifier")} id={generateId(parentPath, identifier)}>
      {typeof identifier === "number" ? `[${identifier}]` : `"${identifier}"`}
    </span>
  );
}

function ExpandButton(props: ExpandedButtonProps) {
  return (
    <button
      className={cx("expand-button", { expanded: props.isExpanded })}
      onClick={props.onClick}
    ></button>
  );
}

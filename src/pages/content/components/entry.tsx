import { ArrayComponent } from "./array";
import { LiteralComponent } from "./literal";
import { ObjectComponent } from "./object";
import classnames from "classnames/bind";
import styles from "./entry.module.css";
import { ROOT_IDENTIFIER } from "../constants";
import { escape } from "@src/utils/json/pointer";
import {
  CollapsibleRef,
  EntryProps,
  ExpandedButtonProps,
  Identifier as Identity,
  IdentifierProps,
  JsonArray,
  JsonObject,
  JsonValue,
  Literal,
} from "@src/types";
import { forwardRef, useCallback, useMemo } from "react";
import { getJsonType, isLiteral } from "@src/utils/json";
import { useCollapsed } from "../store";
const cx = classnames.bind(styles);



export const Entry = forwardRef<CollapsibleRef, EntryProps>(function Entry(
  props: EntryProps,
  ref
) {
  const id = useMemo(
    () => generateId(props.parentPath, props.identifier),
    [props.parentPath, props.identifier]
  );
  const expanded = useCollapsed((state) => !state.collapsed.has(id));
  const expand = useCollapsed((state) => state.expand);
  const collapse = useCollapsed((state) => state.collapse);
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
    expanded ? collapse(id) : expand(id);
  }, [expanded, expand, collapse, id]);

  const downwardsCollapse = useCallback(() => {
    if (valueIsLiteral) { return; }

  }, [valueIsLiteral]);

  return (
    <div className={cx("entry")}>
      {!valueIsLiteral && (
        <ExpandButton onClick={handleExpand} isExpanded={expanded} />
      )}
      {showIdentifier && (
        <>
          <Identifier identifier={props.identifier} id={id} />
          <KVSeparator />
        </>
      )}
      {type === "object" && (
        <ObjectComponent
          node={props.value as JsonObject}
          expanded={expanded}
          isLast={props.isLast}
          parentPath={props.identifier === ROOT_IDENTIFIER ? "" : id}
        />
      )}
      {type === "array" && (
        <ArrayComponent
          node={props.value as JsonArray}
          expanded={expanded}
          parentPath={props.identifier === ROOT_IDENTIFIER ? "" : id}
          isLast={props.isLast}
        />
      )}
      {valueIsLiteral && (
        <LiteralComponent node={props.value as Literal} isLast={props.isLast} />
      )}
    </div>
  );
});

function generateId(parentPath: string, identifier: Identity) {
  return `${parentPath}/${escape(identifier.toString())}`;
}

function KVSeparator() {
  return <span className={cx("kv-separator")}>:&nbsp;</span>;
}

function Identifier({ identifier, id }: IdentifierProps) {
  return (
    <span className={cx("identifier")} id={id}>
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

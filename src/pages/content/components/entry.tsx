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
  Literal
} from "@src/types";

import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  memo,
  useRef,
  useState,
} from "react";
import { getJsonType, isLiteral } from "@src/utils/json";

const cx = classnames.bind(styles);

export const Entry = forwardRef<CollapsibleRef, EntryProps>(function Entry(
  props: EntryProps,
  ref
) {
  console.log("entry");
  const id = useMemo(
    () => generateId(props.parentPath, props.identifier),
    [props.parentPath, props.identifier]
  );
  const childCollapsible = useRef<CollapsibleRef>(null);
  const { expanded, expand, collapse } = useCollapsed();
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

  const handleExpand = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (e.altKey && e.shiftKey) {
        return expanded
          ? childCollapsible.current?.downwardsCollapse()
          : childCollapsible.current?.downwardsExpand();
      }
      if (e.altKey) {
        return expanded ? downwardsCollapse() : downwardsExpand();
      }
      expanded ? collapse() : expand();
    },
    [expanded, expand, collapse]
  );

  const downwardsCollapse = useCallback(() => {
    if (valueIsLiteral) {
      return;
    }
    if (childCollapsible.current) {
      childCollapsible.current.downwardsCollapse();
    }
    collapse();
  }, [valueIsLiteral]);

  const downwardsExpand = useCallback(() => {
    if (valueIsLiteral) {
      return;
    }
    if (childCollapsible.current) {
      childCollapsible.current.downwardsExpand();
    }
    expand();
  }, [valueIsLiteral]);

  useImperativeHandle(ref, () => ({
    downwardsCollapse,
    downwardsExpand,
  }));

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
          ref={childCollapsible}
        />
      )}
      {type === "array" && (
        <ArrayComponent
          node={props.value as JsonArray}
          expanded={expanded}
          parentPath={props.identifier === ROOT_IDENTIFIER ? "" : id}
          isLast={props.isLast}
          ref={childCollapsible}
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

function useCollapsed() {
  const [collapsed, setCollapsed] = useState(false);

  return {
    collapsed,
    expanded: !collapsed,
    expand: useCallback(() => setCollapsed(false), []),
    collapse: useCallback(() => setCollapsed(true), []),
  };
}

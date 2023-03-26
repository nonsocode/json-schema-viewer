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
  Literal,
  PropsWithRef,
} from "@src/types";

import { getJsonType, isLiteral } from "@src/utils/json";
import { createSignal } from "solid-js";

const cx = classnames.bind(styles);

export const Entry = function Entry(
  props: PropsWithRef<EntryProps, CollapsibleRef>
) {
  const id = generateId(props.parentPath, props.identifier);
  let childCollapsible: CollapsibleRef;

  const { expanded, expand, collapse } = useCollapsed();
  const type = getJsonType(props.value);

  const valueIsLiteral = isLiteral(props.value);

  const showIdentifier =
    props.identifier !== undefined &&
    props.identifier !== ROOT_IDENTIFIER &&
    typeof props.identifier !== "number";

  const handleExpand = (e: MouseEvent) => {
    if (e.altKey && e.shiftKey) {
      return expanded()
        ? childCollapsible?.downwardsCollapse()
        : childCollapsible?.downwardsExpand();
    }
    if (e.altKey) {
      return expanded() ? downwardsCollapse() : downwardsExpand();
    }
    expanded() ? collapse() : expand();
  };

  const downwardsCollapse = () => {
    if (valueIsLiteral) {
      return;
    }
    if (childCollapsible) {
      childCollapsible.downwardsCollapse();
    }
    collapse();
  };

  const downwardsExpand = () => {
    if (valueIsLiteral) {
      return;
    }
    if (childCollapsible) {
      childCollapsible.downwardsExpand();
    }
    expand();
  };

  props.ref({
    downwardsCollapse,
    downwardsExpand,
  })

  return (
    <div class={cx("entry")}>
      {!valueIsLiteral && (
        <ExpandButton onClick={handleExpand} isExpanded={expanded()} />
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
          expanded={expanded()}
          isLast={props.isLast}
          parentPath={props.identifier === ROOT_IDENTIFIER ? "" : id}
          ref={(collapsible) => {
            childCollapsible = collapsible;
          }}
        />
      )}
      {type === "array" && (
        <ArrayComponent
          node={props.value as JsonArray}
          expanded={expanded()}
          parentPath={props.identifier === ROOT_IDENTIFIER ? "" : id}
          isLast={props.isLast}
          ref={(collapsible) => {
            childCollapsible = collapsible;
          }}
        />
      )}
      {valueIsLiteral && (
        <LiteralComponent node={props.value as Literal} isLast={props.isLast} />
      )}
    </div>
  );
};

function generateId(parentPath: string, identifier: Identity) {
  return `${parentPath}/${escape(identifier.toString())}`;
}

function KVSeparator() {
  return <span class={cx("kv-separator")}>:&nbsp;</span>;
}

function Identifier({ identifier, id }: IdentifierProps) {
  return (
    <span class={cx("identifier")} id={id}>
      {typeof identifier === "number" ? `[${identifier}]` : `"${identifier}"`}
    </span>
  );
}

function ExpandButton(props: ExpandedButtonProps) {
  return (
    <button
      class={cx("expand-button", { expanded: props.isExpanded })}
      onClick={props.onClick}
    ></button>
  );
}

function useCollapsed() {
  const [collapsed, setCollapsed] = createSignal(false);

  return {
    collapsed,
    expanded: () => !collapsed(),
    expand: () => setCollapsed(false),
    collapse: () => setCollapsed(true),
  };
}

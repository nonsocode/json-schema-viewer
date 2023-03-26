import { Identifier, JsonArray, JsonObject, JsonValue, Literal } from "./json";
import { JSX } from "solid-js";

export type CommonValueProps = {
  isLast: boolean;
};
export type EntryProps = CommonValueProps & {
  identifier?: Identifier;
  value: JsonValue;
  parentPath: string;
};

export type IdentifierProps = {
  identifier: Identifier;
  id: string;
};

export type ObjectComponentProps = CommonValueProps & {
  node: JsonObject;
  parentPath: string;
  expanded: boolean;
};

export type LiteralComponentProps = CommonValueProps & {
  node: Literal;
};

export type PropsWithRef<Props, Ref> = Props & { ref: (ref: Ref) => void };
export type ArrayComponentProps = CommonValueProps & {
  node: JsonArray;
  expanded: boolean;
  parentPath: string;
};

export type ExpandedButtonProps = {
  onClick: JSX.EventHandler<HTMLButtonElement, MouseEvent>;
  isExpanded: boolean;
};

export type SummaryProps = {
  content: string;
};

export type CollapsibleRef = {
  downwardsCollapse(): void;
  downwardsExpand(): void;
};

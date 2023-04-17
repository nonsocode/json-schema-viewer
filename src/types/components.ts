import React from "react";
import { Identifier, JsonArray, JsonObject, JsonValue, Literal } from "./json";

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

export type ArrayComponentProps = CommonValueProps & {
  node: JsonArray;
  expanded: boolean;
  parentPath: string;
};

export type ExpandedButtonProps = {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  isExpanded: boolean;
};

export type SummaryProps = {
  content: string;
};

export type CollapsibleRef = {
  downwardsCollapse(): void;
  downwardsExpand(): void;
};

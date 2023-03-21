import { Identifier, JsonArray, JsonObject, JsonValue, Literal } from "./json";

export type CommonValueProps = {};
export type EntryProps = CommonValueProps & {
  identifier?: Identifier;
  value: JsonValue;
  isLast: boolean;
  parentPath: string;
};

export type IdentifierProps = {
  identifier: Identifier;
  parentPath: string;
};


export type ObjectComponentProps = CommonValueProps & {
  node: JsonObject;
  parentPath: string;
};

export type LiteralComponentProps = CommonValueProps & {
  node: Literal;
};

export type ArrayComponentProps = CommonValueProps & {
  node: JsonArray;
  parentPath: string;
};

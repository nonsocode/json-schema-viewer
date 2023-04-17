export type Identifier = string | number;
export type Literal = string | number | boolean | null;
export type JsonArray = JsonValue[];
export type JsonObject = { [k: Identifier]: JsonValue };
export type JsonValue = Literal | JsonArray | JsonObject;
export type JsonType =
  | "string"
  | "number"
  | "boolean"
  | "null"
  | "array"
  | "object";

import { JsonArray, JsonObject, JsonType, JsonValue, Literal } from "@src/types";

export function getJsonType(value: JsonValue): JsonType {
  if (value === null) {
    return "null";
  }
  if (Array.isArray(value)) {
    return "array";
  }
  if (typeof value === "object") {
    return "object";
  }
  if (typeof value === "string") {
    return "string";
  }
  if (typeof value === "number") {
    return "number";
  }
  if (typeof value === "boolean") {
    return "boolean";
  }
  throw new Error("Unknown json type");
}

export function isLiteral(value: JsonValue): value is Literal {
  return typeof value !== "object";
}

export function isObject(value: JsonValue): value is JsonObject {
  return typeof value === "object" && !isArray(value);
}

export function isArray(value: JsonValue): value is JsonArray {
  return Array.isArray(value);
}
import { JsonValue } from "@src/types";
import { ValueNode } from "json-to-ast";
import { getJsonType, isArray, isObject } from ".";

const hasExcape = /~/;
const escapeMatcher = /~[01]/g;

const compiledCache: Map<string, string[]> = new Map();
function escapeReplacer(m) {
  switch (m) {
    case "~1":
      return "/";
    case "~0":
      return "~";
  }
  throw new Error("Invalid tilde escape: " + m);
}

export function untilde(str: string) {
  if (!hasExcape.test(str)) return str;
  return str.replace(escapeMatcher, escapeReplacer);
}

export function escape(str: string) {
  return str.replace(/~/g, "~0").replace(/\//g, "~1");
}

function compilePointer(pointer: string): string[] {
  if (compiledCache.has(pointer)) return compiledCache.get(pointer);
  const compiled = pointer.split("/").map(untilde);
  if (compiled[0] !== "") {
    throw new Error("Invalid JSON pointer.");
  }
  compiledCache.set(pointer, compiled);
  return compiled;
}

export function get(obj: JsonValue, pointer: string): JsonValue {
  if (pointer === "" || pointer === "/") return obj;
  const compiled = compilePointer(pointer);
  const len = compiled.length;
  if (len === 1) return obj;

  for (let p = 1; p < len; p++) {
    const key = compiled[p];
    if (isObject(obj)) {
      if (key in obj) {
        obj = obj[key];
      } else {
        throw new Error("Invalid JSON pointer.");
      }
    } else if (isArray(obj)) {
      const index = parseInt(key, 10);
      if (isNaN(index) || index >= obj.length) {
        throw new Error("Invalid JSON pointer.");
      }
      obj = obj[index];
    } else {
      throw new Error("Invalid JSON pointer.");
    }
  }
  return obj;
}

import { ValueNode } from "json-to-ast";

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

export function get(obj: ValueNode, pointer: string): ValueNode | null {
  const compiled = compilePointer(pointer);
  const len = compiled.length;
  if (len === 1) return obj;

  outer: for (let p = 1; p < len; p++) {
    const key = compiled[p];
    if (obj.type === "Object") {
      const children = obj.children;
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        if (child.key.value === key) {
          obj = child.value;
          continue outer;
        }
      }
      return null
    } else if (obj.type === "Array") {
      const index = parseInt(key, 10);
      if (isNaN(index) || index >= obj.children.length) {
        throw new Error("Invalid JSON pointer.");
      }
      obj = obj.children[index];
    } else {
      throw new Error("Invalid JSON pointer.");
    }
  }
  return obj
}

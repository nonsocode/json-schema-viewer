import { useMemo } from "react";
import jta from "json-to-ast";
import { ObjectComponent } from "./object";
import { ArrayComponent } from "./array";
import { LiteralComponent } from "./literal";
import { CommonValueProps } from "../types";
import { Entry } from "./entry";
interface AppProps {
  jsonString: string;
}
const componentMap = {
  Object: ObjectComponent,
  Array: ArrayComponent,
  Literal: LiteralComponent,
};
export default function App({ jsonString }: AppProps) {
  const tree = useMemo(() => {
    console.time();
    const res = jta(jsonString, {
      loc: false,
    });
    console.timeEnd();
    return res;
  }, [jsonString]);

  const defaultProps: CommonValueProps = { root: tree, isLast: true };
  return <Entry />
  switch (tree.type) {
    case "Object":
      return <ObjectComponent node={tree} {...defaultProps} />;
    case "Array":
      return <ArrayComponent node={tree} {...defaultProps} />;
    case "Literal":
      return <LiteralComponent node={tree} {...defaultProps} />;
    default:
      return <></>;
  }
}

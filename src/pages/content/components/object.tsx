import { CommonValueProps } from "../types";
import classnames from "classnames/bind";
import style from "./object.module.css";
import { Entry } from "./entry";
import { useCallback, useContext, useMemo, useState } from "react";
import { LiteralNode, PropertyNode, ValueNode } from "json-to-ast";
import { isUrl } from "@src/utils/json/url";
import { UrlContext, UrlProvider } from "../context/url";
import { astStore } from "../store";
import { useQuery } from "../hooks";
import jsonToAst from "json-to-ast";
import { get } from "@src/utils/json/pointer";
const cx = classnames.bind(style);

type ObjectComponentProps = CommonValueProps & {
  node: jsonToAst.ObjectNode;
  parentPath: string;
};
export function ObjectComponent(props: ObjectComponentProps) {
  const refNode: LiteralNode = useMemo(() => {
    const prop = props.node.children.find(
      (prop) =>
        prop.key.value === "$ref" &&
        prop.value.type === "Literal" &&
        typeof prop.value.value === "string" &&
        isUrl(prop.value.value)
    );
    if (prop) return prop.value as LiteralNode;
  }, [props.node.children]);

  const urlContext = useContext(UrlContext);

  const refUrl: URL = useMemo(() => {
    if (!refNode) return;
    const partialUrl = refNode.value as string;
    let url: URL;
    if (partialUrl.startsWith("#")) {
      url = new URL(urlContext.fullPath);
      url.hash = partialUrl;
    } else {
      url = new URL(partialUrl);
    }
    return url;
  }, [refNode]);

  const [derrefed, setDerefed] = useState(false);

  const { loading, query, error, data } = useQuery(fetchAndCache);

  const onClick = useCallback(async () => {
    if (!refNode) return;
    if (!derrefed) await query(refUrl);
    setDerefed(!derrefed);
  }, [derrefed, refNode, query]);

  const nodes: PropertyNode[] = useMemo(() => {
    if (derrefed) {
      return props.node.children.filter((prop) => prop.key.value !== "$ref");
    } else {
      return props.node.children;
    }
  }, [derrefed]);

  const nodesFromRef: PropertyNode[] = useMemo(() => {
    if (!derrefed || error || loading || !data) {
      return [];
    }
    if (data.type !== "Object") {
      return [];
    }
    const nodes = get(data, refUrl.hash.slice(1) || "/");
    if(!nodes || nodes.type !== "Object") {
      return [];
    }
    return nodes.children;
  }, [derrefed, data]);

  return (
    <>
      <ObjectOpener />
      {!!refNode && (
        <RefButton onClick={onClick}>{derrefed ? "re-ref" : "deref"}</RefButton>
      )}
      <div className={cx("object-block")}>
        {derrefed && nodesFromRef.length && (
          <UrlProvider fullPath={refUrl.origin + refUrl.pathname}>
            {nodesFromRef.map((prop, index) => (
              <Entry
                key={index + prop.key.value}
                root={props.root}
                value={prop.value}
                parentPath={props.parentPath}
                identifier={prop.key}
                isLast={index === nodesFromRef.length - 1}
              />
            ))}
          </UrlProvider>
        )}
        {nodes.map((prop, index) => (
          <Entry
            key={index + prop.key.value}
            root={props.root}
            value={prop.value}
            parentPath={props.parentPath}
            identifier={prop.key}
            isLast={index === nodes.length - 1}
          />
        ))}
      </div>
      <ObjectCloser />
    </>
  );
}

function ObjectOpener() {
  return <span className={cx("object-opener")}>{"{"}</span>;
}
function ObjectCloser() {
  return <span className={cx("object-closer")}>{"}"}</span>;
}

type RefButtonProps = {
  children: React.ReactNode;
  disabled?: boolean;
  onClick: () => void;
};
function RefButton(props: RefButtonProps) {
  return (
    <button
      className={cx("ref-button")}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
}

async function fetchAndCache(url: URL) {
  const fullPath = url.origin + url.pathname;
  if (astStore.has(fullPath)) {
    return astStore.get(fullPath);
  }
  const res = await fetch(url);
  if (!res.ok) throw new Error(res.statusText);
  const jsonText = await res.text();
  const ast = jsonToAst(jsonText);
  astStore.set(url.origin + url.pathname, ast);
  return ast;
}

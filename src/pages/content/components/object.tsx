import classnames from "classnames/bind";
import style from "./object.module.css";
import { Entry } from "./entry";
import {
  forwardRef,
  memo,
  useCallback,
  useContext,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { UrlContext, UrlProvider } from "../context/url";
import { jsonTreeCache } from "../cache";
import { useCollapsibles, useQuery } from "../hooks";
import { get } from "@src/utils/json/pointer";
import {
  CollapsibleRef,
  EntryProps,
  JsonValue,
  ObjectComponentProps,
} from "@src/types";
import { getJsonType } from "@src/utils/json";
import { Elipsis } from "./elipsis";
import { Summary } from "./summary";
const cx = classnames.bind(style);

export const ObjectComponent = memo(
  forwardRef<CollapsibleRef, ObjectComponentProps>(function ObjectComponent(
    props: ObjectComponentProps,
    ref
  ) {
    const $ref: string | undefined = useMemo(() => {
      if (props.node["$ref"] && typeof props.node["$ref"] === "string")
        return props.node["$ref"];
    }, [props.node.children]);

    const entries: EntryProps[] = useMemo(() => {
      return Object.entries(props.node).map<EntryProps>(
        ([key, value], index, { length }) => ({
          isLast: index === length - 1,
          identifier: key,
          value,
          parentPath: props.parentPath,
        })
      );
    }, [props.node.children]);

    const urlContext = useContext(UrlContext);

    const refUrl: URL = useMemo(() => {
      if (!$ref) return;
      let url: URL;
      if ($ref.startsWith("http")) {
        url = new URL($ref);
      } else {
        url = new URL($ref, urlContext.fullPath);
      }
      return url;
    }, [$ref]);

    const [derrefed, setDerefed] = useState(false);

    const { loading, query, error, data } = useQuery(fetchAndCache);

    const onClick = useCallback(async () => {
      if (!$ref) return;
      if (!derrefed) await query(refUrl);
      setDerefed(!derrefed);
    }, [derrefed, $ref, query]);

    const nodes: EntryProps[] = useMemo(() => {
      if (derrefed) {
        return entries.filter((prop) => prop.identifier !== "$ref");
      } else {
        return entries;
      }
    }, [derrefed, entries]);

    const nodesFromRef: EntryProps[] = useMemo(() => {
      if (!derrefed || error || loading || !data) {
        return [];
      }
      if (getJsonType(data) !== "object") {
        return [];
      }
      const nodes = get(data, refUrl.hash.slice(1) || "/");
      if (!nodes || getJsonType(nodes) !== "object") {
        return [];
      }
      return Object.entries(nodes).map(
        ([identifier, value], index, { length }) => ({
          value,
          identifier,
          parentPath: props.parentPath,
          isLast: index === length - 1,
        })
      );
    }, [derrefed, data]);

    const summary: string = useMemo(() => {
      if (derrefed) {
        const totalNodes = nodesFromRef.length + nodes.length;
        return `${totalNodes} item${totalNodes > 1 ? "s" : ""}`;
      }
      return `${nodes.length} item${nodes.length > 1 ? "s" : ""}`;
    }, [nodes, nodesFromRef, derrefed]);

    const [, createEntryRef] = useCollapsibles(ref);

    return (
      <>
        <span className={cx("object-opener")}>{"{"}</span>
        {!!$ref && (
          <RefButton
            onClick={onClick}
            toggled={derrefed}
            className={cx({ "object-hidden": !props.expanded })}
          />
        )}
        <div
          className={cx("object-block", {
            "object-hidden":
              !props.expanded || nodesFromRef.length + nodes.length === 0,
          })}
        >
          {derrefed && nodesFromRef.length && (
            <UrlProvider fullPath={refUrl.origin + refUrl.pathname}>
              {nodesFromRef.map((prop, index) => {
                const key = `${index}-${prop.identifier}`;
                const isLast =
                  index === nodesFromRef.length - 1 && nodes.length === 0;
                return (
                  <Entry
                    key={key}
                    {...prop}
                    isLast={isLast}
                    ref={(ref) => createEntryRef(ref, key, prop.value)}
                  />
                );
              })}
            </UrlProvider>
          )}
          {nodes.map((prop, index) => {
            const key = `${index}-${prop.identifier}`;
            return (
              <Entry
                key={key}
                {...prop}
                ref={(ref) => createEntryRef(ref, key, prop.value)}
              />
            );
          })}
        </div>
        <Elipsis className={cx({ "object-hidden": props.expanded })} />
        <span className={cx("object-closer")}>{"}"}</span>
        {props.isLast ? "" : ","}
        {!props.expanded && <Summary content={summary} />}
      </>
    );
  })
);

type RefButtonProps = {
  disabled?: boolean;
  toggled?: boolean;
  onClick: () => void;
  className?: string;
};
function RefButton(props: RefButtonProps) {
  return (
    <button
      className={cx("ref-button", { toggled: props.toggled }, props.className)}
      onClick={props.onClick}
      disabled={props.disabled}
    ></button>
  );
}

async function fetchAndCache(url: URL) {
  const fullPath = url.origin + url.pathname;
  if (jsonTreeCache.has(fullPath)) {
    return jsonTreeCache.get(fullPath);
  }
  const res = await fetch(url);
  if (!res.ok) throw new Error(res.statusText);
  const tree: JsonValue = await res.json();
  jsonTreeCache.set(url.origin + url.pathname, tree);
  return tree;
}

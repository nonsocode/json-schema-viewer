import { CollapsibleRef } from "@src/types";
import { Accessor, createSignal } from "solid-js";

type UseQueryFn<Args extends unknown[], T extends unknown> = (
  ...args: Args
) => Promise<T>;

type UseQuery<Args extends unknown[], T extends unknown> = {
  data: Accessor<T | undefined>;
  error: Accessor<Error | undefined>;
  loading: Accessor<boolean>;
  query: UseQueryFn<Args, T>;
};

export function useQuery<Args extends unknown[], T extends unknown>(
  fn: UseQueryFn<Args, T>
): UseQuery<Args, T> {
  const [data, setData] = createSignal<T>();
  const [error, setError] = createSignal<Error>();
  const [loading, setLoading] = createSignal(false);

  const query: UseQueryFn<Args, T> = async (...args) => {
    setLoading(true);
    try {
      const result = await fn(...args);
      setData(result as any);
      return result;
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  return { data, error, loading, query };
}

export function useCollapsibles(ref: (ref: CollapsibleRef) => void) {
  const collapsibles = new Set<CollapsibleRef>();
  const downwardsCollapse = () => {
    if (collapsibles.size === 0) return;
    for (const collapsible of collapsibles) {
      collapsible.downwardsCollapse();
    }
  };

  const downwardsExpand = () => {
    if (collapsibles.size === 0) return;
    for (const collapsible of collapsibles) {
      collapsible.downwardsExpand();
    }
  };

  ref({
    downwardsCollapse,
    downwardsExpand,
  });

  return (ref: CollapsibleRef) => {
    collapsibles.add(ref);
  };
}

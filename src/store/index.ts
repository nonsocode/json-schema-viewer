import { useEffect, useState } from "react";

type Selector<T extends object, R extends unknown> = (state: T) => R;
type UseStore<T extends object> = <R extends unknown>(
  selector: Selector<T, R>
) => R;
type PartialSetter<T> = (state: T) => Partial<T>;
type Setter<T extends object> = (setter: PartialSetter<T>) => void;
type StoreInitializer<T extends object> = (set: Setter<T>) => T;
export function createStore<T extends object>(
  initializer: StoreInitializer<T>
): UseStore<T> {
  let store = initializer(set);
  const listeners = new Set<() => void>();
  function set(setter: PartialSetter<T>) {
    store = { ...store, ...setter(store) };
    listeners.forEach((listener) => {listener()});
  }
  function useStore<R extends unknown>(selector: Selector<T, R>): R {
    const [value, setValue] = useState(() => selector(store));
    useEffect(() => {
      const listener = () => setValue(() => selector(store));
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    }, [selector]);
    return value;
  }
  return useStore;
}

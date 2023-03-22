import { createStore } from "@src/store";

type CollapsedStore = {
  collapsed: Set<string>;
  toggleCollapsed: (id: string) => void;
}
export const useCollapsed = createStore<CollapsedStore>((set) => {
  const collapsed = new Set<string>();
  return {
    collapsed,
    toggleCollapsed: (id: string) => {
      if (collapsed.has(id)) {
        collapsed.delete(id);
      } else {
        collapsed.add(id);
      }
      set(state => state);
    },
  };
})
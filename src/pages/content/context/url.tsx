import { createContext, JSX } from "solid-js";

type UrlContextType = {
  fullPath: string;
};
const defaultPath =
  new URL(document.URL).origin + new URL(document.URL).pathname;

export const UrlContext = createContext<UrlContextType>({
  fullPath: defaultPath,
});

type UrlProviderProps = {
  fullPath?: string;
  children: JSX.Element;
};

export function UrlProvider({
  fullPath = defaultPath,
  children,
}: UrlProviderProps) {
  return (
    <UrlContext.Provider value={{ fullPath }}>{children}</UrlContext.Provider>
  );
}

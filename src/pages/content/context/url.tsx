import { createContext } from "react";

type UrlContext = {
  fullPath: string;
};
const defaultPath =
  new URL(document.URL).origin + new URL(document.URL).pathname;
export const UrlContext = createContext<UrlContext>({
  fullPath: defaultPath,
});
type UrlProviderProps = React.PropsWithChildren<{}> & {
  fullPath?: string;
};
export function UrlProvider({
  fullPath = defaultPath,
  children,
}: UrlProviderProps) {
  return (
    <UrlContext.Provider value={{ fullPath }}>{children}</UrlContext.Provider>
  );
}

import {
  type PropsWithChildren,
  createContext,
  useContext,
  useCallback,
  useMemo,
} from "react";

import { useIdentityStorage } from "./storage";
import type { Identity, IdentityData, Profile } from "./types";
import { buildIdentity } from "./util";

export const IdentityContext = createContext<{
  data: IdentityData;
  setData: (newData: IdentityData) => void;
}>({ data: { known: "nothing" }, setData: () => {} });

/**
 * Reads or modifies data from the encompassing identity context.
 *
 * @see IdentityProvider
 * @example
 * const identity = useIdentity();
 */
export const useIdentity = (): Identity => {
  const { data, setData } = useContext(IdentityContext);

  const logIn = useCallback(
    (token: string) => setData({ known: "account", token }),
    [setData],
  );
  const logOut = useCallback(() => setData({ known: "nothing" }), [setData]);
  const selectProfile = useCallback(
    (profile: Profile) =>
      setData(
        data.known !== "nothing"
          ? {
              known: "profile",
              token: data.token,
              profile,
            }
          : data,
      ),
    [data, setData],
  );

  return useMemo(
    () => buildIdentity(data, { logIn, logOut, selectProfile }),
    [data, logIn, logOut, selectProfile],
  );
};

/**
 * Provides identity context access to its children.
 *
 * @see useIdentity
 */
export const IdentityProvider = ({ children }: PropsWithChildren) => {
  const [data, setData] = useIdentityStorage({ known: "nothing" });
  return (
    <IdentityContext.Provider value={{ data, setData }}>
      {children}
    </IdentityContext.Provider>
  );
};

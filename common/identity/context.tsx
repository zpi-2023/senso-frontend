import {
  type PropsWithChildren,
  createContext,
  useContext,
  useCallback,
  useMemo,
} from "react";

import { useIdentityStorage } from "./storage";
import {
  Identity,
  IdentityData,
  LogIn,
  LogOut,
  Profile,
  SelectProfile,
} from "./types";

const IdentityContext = createContext<{
  data: IdentityData;
  setData: (newData: IdentityData) => void;
}>({ data: { known: "nothing" }, setData: () => {} });

const buildIdentity = (
  data: IdentityData,
  {
    logIn,
    logOut,
    selectProfile,
  }: { logIn: LogIn; logOut: LogOut; selectProfile: SelectProfile },
): Identity => {
  if (data.known === "nothing") {
    return { isLoggedIn: false, hasProfile: false, logIn };
  }

  const common = {
    token: data.token,
    isLoggedIn: true as const,
    logOut,
    selectProfile,
  };

  switch (data.known) {
    case "account":
      return {
        ...common,
        hasProfile: false,
      };
    case "profile":
      return {
        ...common,
        profile: data.profile,
        hasProfile: true,
      };
  }
};

/**
 * Reads or modifies data from the encompassing identity context.
 *
 * @see IdentityProvider
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

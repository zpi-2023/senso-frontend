import {
  type PropsWithChildren,
  type Dispatch,
  type SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

import { Identity, IdentityData, Profile } from "./types";

const IdentityContext = createContext<{
  data: IdentityData;
  setData: Dispatch<SetStateAction<IdentityData>>;
}>({ data: { known: "nothing" }, setData: () => {} });

/**
 * Reads or modifies data from the encompassing identity context.
 *
 * @see IdentityProvider
 */
export const useIdentity = (): Identity => {
  const { data, setData } = useContext(IdentityContext);

  const logOut = () => setData({ known: "nothing" });
  const logIn = (token: string) => setData({ known: "account", token });
  const selectProfile = (profile: Profile) =>
    setData((data) =>
      data.known !== "nothing"
        ? {
            known: "profile",
            token: data.token,
            profile,
          }
        : data,
    );

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
 * Provides identity context access to its children.
 *
 * @see useIdentity
 */
export const IdentityProvider = ({ children }: PropsWithChildren) => {
  const [data, setData] = useState<IdentityData>({ known: "nothing" });
  return (
    <IdentityContext.Provider value={{ data, setData }}>
      {children}
    </IdentityContext.Provider>
  );
};

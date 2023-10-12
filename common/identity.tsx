import {
  type PropsWithChildren,
  createContext,
  useContext,
  useState,
} from "react";

type IdentityData = {
  token: string | null;
  setToken: (token: string | null) => void;
};

const IdentityContext = createContext<IdentityData>({
  token: null,
  setToken: () => {},
});

/**
 * Reads or modifies data from the encompassing identity context.
 *
 * @see IdentityProvider
 */
export const useIdentity = () => useContext(IdentityContext);

/**
 * Provides identity context access to its children.
 *
 * @see useIdentity
 */
export const IdentityProvider = ({ children }: PropsWithChildren) => {
  const [token, setToken] = useState<string | null>(null);
  return (
    <IdentityContext.Provider value={{ token, setToken }}>
      {children}
    </IdentityContext.Provider>
  );
};

import {
  type PropsWithChildren,
  createContext,
  useContext,
  useState,
} from "react";

type AuthData = {
  token: string | null;
  setToken: (token: string | null) => void;
};

const AuthContext = createContext<AuthData>({
  token: null,
  setToken: () => {},
});

/**
 * Reads or modifies data from the encompassing authorization context.
 *
 * @see AuthProvider
 */
export const useAuth = () => useContext(AuthContext);

/**
 * Provides authorization context access to its children.
 *
 * @see useAuth
 */
export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [token, setToken] = useState<string | null>(null);
  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

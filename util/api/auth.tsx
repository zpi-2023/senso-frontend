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

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [token, setToken] = useState<string | null>(null);
  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

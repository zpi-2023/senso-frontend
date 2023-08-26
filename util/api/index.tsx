import { PropsWithChildren } from "react";

import { AuthProvider } from "./auth";

const ApiProvider = ({ children }: PropsWithChildren) => {
  return <AuthProvider>{children}</AuthProvider>;
};

export { useAuth } from "./auth";
export { useApi } from "./swr";
export { ApiProvider };

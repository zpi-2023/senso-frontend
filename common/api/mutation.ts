import {
  type MethodPath,
  type MethodOptions,
  POST,
  PUT,
  PATCH,
  DELETE,
} from "./client";
import { useIdentity } from "../identity";

export const useMutation = () => {
  const identity = useIdentity();

  const common = identity.isLoggedIn
    ? { headers: { Authorization: `Bearer ${identity.token}` } }
    : {};

  return {
    post: <P extends MethodPath<"post">>(
      url: P,
      init: MethodOptions<"post", P>,
    ) => POST(url, { ...init, ...common }),
    put: <P extends MethodPath<"put">>(url: P, init: MethodOptions<"put", P>) =>
      PUT(url, { ...init, ...common }),
    patch: <P extends MethodPath<"patch">>(
      url: P,
      init: MethodOptions<"patch", P>,
    ) => PATCH(url, { ...init, ...common }),
    del: <P extends MethodPath<"delete">>(
      url: P,
      init: MethodOptions<"delete", P>,
    ) => DELETE(url, { ...init, ...common }),
  };
};

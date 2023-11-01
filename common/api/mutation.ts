import {
  type MethodPath,
  type MethodOptions,
  POST,
  PUT,
  PATCH,
  DELETE,
} from "./client";
import { useIdentity } from "../identity";

export const useMutation = <
  M extends "post" | "put" | "patch" | "delete",
  P extends MethodPath<M>,
>(
  method: M,
  url: P,
) => {
  const identity = useIdentity();

  const common = identity.isLoggedIn
    ? { headers: { Authorization: `Bearer ${identity.token}` } }
    : {};

  const executor = { post: POST, put: PUT, patch: PATCH, delete: DELETE }[
    method
  ] as (
    url: P,
    options: MethodOptions<M, P>,
  ) => ReturnType<
    {
      post: typeof POST<P extends MethodPath<"post"> ? P : never>;
      put: typeof PUT<P extends MethodPath<"put"> ? P : never>;
      patch: typeof PATCH<P extends MethodPath<"patch"> ? P : never>;
      delete: typeof DELETE<P extends MethodPath<"delete"> ? P : never>;
    }[M]
  >;

  return (options: MethodOptions<M, P>) =>
    executor(url, { ...options, ...common });
};

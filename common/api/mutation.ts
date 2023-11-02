import {
  type MethodPath,
  type MethodOptions,
  POST,
  PUT,
  PATCH,
  DELETE,
} from "./client";
import { useIdentity } from "../identity";

/**
 * Wrapper which should be used for all POST, PUT, PATCH and DELETE requests within components.
 * You have to specify the method and URL beforehand, but params and body might vary later.
 *
 * @param method HTTP method of the request
 * @param url URL of the API endpoint from the Swagger spec
 * @see https://openapi-ts.pages.dev/openapi-fetch
 *
 * @example
 * const createSeniorProfile = useMutation("post", "/api/v1/account/profiles/senior");
 *
 * const obtainToken = useMutation("post", "/api/v1/token");
 */
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
      // Yeah, let's make our type system Turing-complete, what could go wrong?
      post: typeof POST<P extends MethodPath<"post"> ? P : never>;
      put: typeof PUT<P extends MethodPath<"put"> ? P : never>;
      patch: typeof PATCH<P extends MethodPath<"patch"> ? P : never>;
      delete: typeof DELETE<P extends MethodPath<"delete"> ? P : never>;
    }[M]
  >;

  return (options: MethodOptions<M, P>) =>
    executor(url, { ...options, ...common });
};

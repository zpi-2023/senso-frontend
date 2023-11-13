import { rest } from "msw";
import { setupServer } from "msw/node";

import type { MethodPath } from "./client";
import { BASE_URL } from "./consts";

type CrudMethod = "get" | "post" | "put" | "patch" | "delete";
type PromiseOrValue<T> = Promise<T> | T;
type ResolverParams<M extends CrudMethod> = Parameters<
  Parameters<(typeof rest)[M]>[1]
>;
type EndpointBody<M extends CrudMethod> = (
  ctx: ResolverParams<M>[2],
  req: ResolverParams<M>[0],
) => PromiseOrValue<Parameters<ResolverParams<M>[1]>[0]>;

export const mockServer = setupServer();

/**
 * Overrides server's response to a request for the duration of one test.
 *
 * @param method lowercase HTTP method name of CRUD operation (`post`, `get`, `put` or `delete`)
 * @param path pattern describing matched endpoints, you can use `*` as a wildcard
 * @param body function handling the request, use `ctx` (passed as first arg) to construct the response
 *
 * @example
 * mockApi("get", "/endpoint-name", (ctx, req) => ctx.json({ name: "Hello world!" }));
 */
export const mockApi = <M extends CrudMethod>(
  method: M,
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents -- https://github.com/microsoft/TypeScript/issues/29729
  path: MethodPath<CrudMethod> | (string & Record<never, never>),
  body: EndpointBody<M>,
) => {
  if (!__DEV__) {
    throw new Error("Unexpected use of mocking in production.");
  }

  mockServer.use(
    rest[method](new URL(path, BASE_URL).toString(), async (req, res, ctx) =>
      res(await body(ctx, req)),
    ),
  );
};

import { rest } from "msw";
import { setupServer } from "msw/node";

import { BASE_URL } from "./consts";

type CrudMethod = "post" | "get" | "put" | "delete";
type PromiseOrValue<T> = Promise<T> | T;
type ResolverParams<M extends CrudMethod> = Parameters<
  Parameters<(typeof rest)[M]>[1]
>;

export const mockServer = setupServer();

export const mockApi = <M extends CrudMethod>(
  method: M,
  path: string,
  body: (
    req: ResolverParams<M>[0],
    ctx: ResolverParams<M>[2],
  ) => PromiseOrValue<Parameters<ResolverParams<M>[1]>[0]>,
) => {
  if (!__DEV__) {
    throw new Error("Unexpected use of mocking in production.");
  }

  mockServer.use(
    rest[method](new URL(path, BASE_URL).toString(), async (req, res, ctx) =>
      res(await body(req, ctx)),
    ),
  );
};

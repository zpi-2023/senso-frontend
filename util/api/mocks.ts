import { rest } from "msw";
import { setupServer } from "msw/node";

export const server = setupServer(
  rest.get("*/User", (_req, res, ctx) => res(ctx.json(["Andrew"]))),
);

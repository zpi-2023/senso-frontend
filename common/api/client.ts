import createClient, { type FetchOptions } from "openapi-fetch";
import type { FilterKeys } from "openapi-typescript-helpers";

import { baseUrl } from "./consts";
import type { paths } from "./schema";

const client = createClient<paths>({ baseUrl });

export const { POST, PUT, PATCH, DELETE } = client;

export type MethodPath<M extends "get" | "post" | "put" | "patch" | "delete"> =
  keyof paths &
    keyof {
      [P in keyof paths as paths[P] extends { [K in M]: unknown }
        ? P
        : never]: P;
    };

export type MethodOptions<
  M extends "get" | "post" | "put" | "patch" | "delete",
  P extends MethodPath<M>,
> = FetchOptions<FilterKeys<paths[P], M>>;

export const fetcher = async <P extends MethodPath<"get">>(
  url: P,
  options: MethodOptions<"get", P>,
) => {
  const { response, data, error } = await client.GET(url, options);
  if (!response.ok) {
    // SWR expects the promise to reject on error and openapi-fetch does not do that by default
    throw new Error("An error occurred while fetching the data.", {
      cause: error,
    });
  }
  return data;
};

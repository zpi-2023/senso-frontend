import createClient, { type FetchOptions } from "openapi-fetch";
import type { FilterKeys } from "openapi-typescript-helpers";

import { BASE_URL } from "./consts";
import type { paths } from "./schema";

const {
  POST: post,
  GET,
  PUT: put,
  DELETE: del,
} = createClient<paths>({ baseUrl: BASE_URL });

type GetPath = keyof {
  [P in keyof paths as paths[P] extends { get: any } ? P : never]: P;
};

type GetOptions<P extends GetPath> = FetchOptions<FilterKeys<paths[P], "get">>;

const get = async <P extends GetPath>(url: P, options: GetOptions<P>) => {
  const { response, data } = await GET(url, options);
  if (!response.ok) {
    // SWR expects the promise to reject on error and openapi-fetch does not do that by default
    throw new Error("An error occurred while fetching the data.");
  }
  return data;
};

export type { GetPath, GetOptions };
export { post, get, put, del };

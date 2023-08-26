import createClient from "openapi-fetch";

import { BASE_URL } from "./consts";
import { paths } from "./schema";

const { GET, POST: post } = createClient<paths>({ baseUrl: BASE_URL });

type GetUrl = Parameters<typeof GET>[0];
type GetOptions = Parameters<typeof GET>[1];

const get = async (url: GetUrl, options?: GetOptions) => {
  const { response, data } = await GET(url, options ?? {});
  if (!response.ok) {
    throw new Error("An error occurred while fetching the data.");
  }
  return data;
};

export type { GetUrl, GetOptions };
export { get, post };

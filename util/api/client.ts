import createClient from "openapi-fetch";

import { BASE_URL } from "./consts";
import { paths } from "./schema";

const { GET, POST: post } = createClient<paths>({ baseUrl: BASE_URL });

const get = async (
  url: Parameters<typeof GET>[0],
  init?: Parameters<typeof GET>[1],
) => {
  const { response, data } = await GET(url, init ?? {});
  if (!response.ok) {
    throw new Error("An error occurred while fetching the data.");
  }
  return data;
};

export { get, post };

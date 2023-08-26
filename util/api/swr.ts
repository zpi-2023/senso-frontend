import useSWR from "swr";

import { get } from "./client";

export const useApi = (url: Parameters<typeof get>[0]) => useSWR([url], get);

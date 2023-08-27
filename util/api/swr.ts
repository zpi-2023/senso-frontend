import useSWR from "swr";

import { useAuth } from "./auth";
import { type GetUrl, get } from "./client";

const TEST_CONFIG = {
  provider: () => new Map(),
  loadingTimeout: 0,
  dedupingInterval: 0,
} as const;

export const useApi = (url: GetUrl) => {
  const { token } = useAuth();
  const headers = { Authorization: `Bearer ${token}` };
  return useSWR(
    [url, { headers }],
    (params) => get(...params),
    __DEV__ ? TEST_CONFIG : undefined,
  );
};

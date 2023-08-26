import useSWR from "swr";

import { useAuth } from "./auth";
import { type GetUrl, get } from "./client";

export const useApi = (url: GetUrl) => {
  const { token } = useAuth();
  const headers = { Authorization: token ? `Bearer ${token}` : undefined };
  return useSWR([url, { headers }], get);
};

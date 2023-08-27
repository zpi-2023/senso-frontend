import useSWR from "swr";

import { useAuth } from "./auth";
import { type GetPath, type GetOptions, get } from "./client";

const TEST_CONFIG = {
  provider: () => new Map(),
  loadingTimeout: 0,
  dedupingInterval: 0,
} as const;

type UseApiArg<P extends GetPath> = { url: P } & Pick<GetOptions<P>, "params">;

export const useApi = <P extends GetPath>({ url, params }: UseApiArg<P>) => {
  const { token } = useAuth();
  const options = {
    ...({ params } as GetOptions<P>),
    headers: { Authorization: `Bearer ${token}` },
  };
  return useSWR(
    [url, options],
    (args) => get(...args),
    __DEV__ ? TEST_CONFIG : undefined,
  );
};

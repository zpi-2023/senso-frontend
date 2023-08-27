import useSWR from "swr";

import { useAuth } from "./auth";
import { type GetPath, type GetOptions, get } from "./client";

const TEST_CONFIG = {
  provider: () => new Map(),
  loadingTimeout: 0,
  dedupingInterval: 0,
} as const;

type UseApiArg<P extends GetPath> =
  | ({ url: P } & Pick<GetOptions<P>, "params">)
  | null;

const buildOptions = <P extends GetPath>(
  { params }: NonNullable<UseApiArg<P>>,
  token: string | null,
): GetOptions<P> => ({
  ...({ params } as GetOptions<P>),
  headers: { Authorization: `Bearer ${token}` },
});

export const useApi = <P extends GetPath>(arg: UseApiArg<P>) => {
  const { token } = useAuth();
  return useSWR(
    arg ? [arg.url, buildOptions(arg, token)] : null,
    (args) => get(...args),
    __DEV__ ? TEST_CONFIG : undefined,
  );
};

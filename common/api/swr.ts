import useSWR from "swr";

import { type GetPath, type GetOptions, fetcher } from "./client";

import { useIdentity } from "@/common/identity";

const TEST_CONFIG = {
  provider: () => new Map(),
  loadingTimeout: 0,
  dedupingInterval: 0,
  shouldRetryOnError: false,
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

/**
 * Wrapper which should be used for all GET requests within components.
 * It automatically handles retries, error handling, caching, deduplication, authorization, etc.
 * Useful properties of the returned object are: `isLoading`, `data`, `error`, `mutate`.
 * Whenever you want to fetch something conditionally, you should pass `null` as the only argument.
 * The hook automatically reacts to changes in the argument and refetches the data.
 * This uses `openapi-fetch` and `swr` underneath, so basic knowledge of these libraries might be useful.
 *
 * @param arg wrapper object containing all other parameters, or `null` for conditional query
 * @param arg.url relative URL of the API endpoint, this must be an exact match of the Swagger spec
 * @param arg.params object containing `path` and `query` parameters of the request
 * @see https://swr.vercel.app/docs/getting-started
 * @see https://openapi-ts.pages.dev/openapi-fetch
 *
 * @example
 * // Simple request
 * const { data: user } = useApi({ url: "/user" });
 * // Request with path params
 * const { data: users } = useApi({ url: "/users/{id}", params: { path: { id: "123" } } });
 * // Request with query params
 * const { data: products } = useApi({
 *     url: "/products",
 *     params: { query: { category: "bikes", color: "red" } }
 * });
 * // Conditional request
 * const [visible, setVisible] = useState(false);
 * const { data: users } = useApi(visible ? { url: "/users" } : null);
 * // Dynamic request
 * const [id, setId] = useState(123);
 * const { data: user } = useApi({ url: "/users/{id}", params: { path: { id } } })
 * // Mutation
 * const { mutate } = useApi({ url: "/products/{id}", params: { path: { id: 123 } } });
 * mutate({ name: "Blue bike" });
 */
export const useApi = <P extends GetPath>(arg: UseApiArg<P>) => {
  const { token } = useIdentity();
  return useSWR(
    arg ? [arg.url, buildOptions(arg, token)] : null,
    (args) => fetcher(...args),
    __DEV__ ? TEST_CONFIG : undefined,
  );
};

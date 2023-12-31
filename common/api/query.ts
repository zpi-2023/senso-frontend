import useSWR, { type SWRResponse } from "swr";

import { type MethodPath, type MethodOptions, fetcher } from "./client";

import { type Identity, useIdentity } from "@/common/identity";

const testConfig = {
  provider: () => new Map(),
  loadingTimeout: 0,
  dedupingInterval: 0,
  shouldRetryOnError: false,
} as const;

type UseQueryArg<P extends MethodPath<"get">> =
  | ({ url: P } & Pick<MethodOptions<"get", P>, "params">)
  | null;

export const buildOptions = <P extends MethodPath<"get">>(
  { params }: NonNullable<UseQueryArg<P>>,
  identity: Identity,
): MethodOptions<"get", P> => ({
  ...({ params } as MethodOptions<"get", P>),
  ...(identity.isLoggedIn
    ? { headers: { Authorization: `Bearer ${identity.token}` } }
    : {}),
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
export const useQuery = <P extends MethodPath<"get">>(arg: UseQueryArg<P>) => {
  const identity = useIdentity();
  return useSWR(
    arg ? [arg.url, buildOptions(arg, identity)] : null,
    (args) => fetcher(...args),
    __DEV__ ? testConfig : undefined,
  ) as SWRResponse<Awaited<ReturnType<typeof fetcher<P>>>, unknown>;
};

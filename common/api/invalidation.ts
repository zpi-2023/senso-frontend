import { type Arguments, useSWRConfig } from "swr";

export const doArgumentsMatch = (args: Arguments, key: string): boolean => {
  if (!args) {
    return false;
  }

  if (Array.isArray(args)) {
    return doArgumentsMatch(args[0], key);
  }

  if (typeof args === "object") {
    if ("url" in args) {
      return doArgumentsMatch(args["url"], key);
    } else {
      return false;
    }
  }

  return args.startsWith(key);
};

/**
 * Invalidates (clears the cache and refetches) all queries which start with the given key.
 *
 * @param key start of the key of the queries to invalidate
 *
 * @example
 * // Returns a function invalidating all queries starting with
 * // "/api/v1/notes/senior", e.g. /api/v1/notes/senior/{seniorId}
 * const invalidateUsers = useQueryInvalidation("/api/v1/notes/senior");
 */
export const useQueryInvalidation = (key: string): (() => Promise<void>) => {
  const { mutate } = useSWRConfig();
  return async () => {
    await mutate((args) => doArgumentsMatch(args, key));
  };
};

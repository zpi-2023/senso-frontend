import { type Arguments, useSWRConfig } from "swr";

const isArgs = (args: unknown): args is Arguments =>
  args === false ||
  args === null ||
  args === undefined ||
  typeof args === "string" ||
  Array.isArray(args) ||
  typeof args === "object";

export const doArgumentsMatch = (
  args: Arguments,
  key: string | null,
): boolean => {
  if (!args || key === null) {
    return false;
  }

  if (Array.isArray(args) && isArgs(args[0])) {
    return doArgumentsMatch(args[0], key);
  }

  if (typeof args === "object") {
    if ("url" in args && isArgs(args["url"])) {
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
export const useQueryInvalidation = (
  key: string | null,
): (() => Promise<void>) => {
  const { mutate } = useSWRConfig();
  return async () => {
    await mutate((args) => doArgumentsMatch(args, key));
  };
};

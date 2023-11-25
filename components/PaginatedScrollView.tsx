import { type ReactNode, useState, Fragment } from "react";
import { IOScrollView } from "react-native-intersection-observer";
import { ActivityIndicator } from "react-native-paper";

import { OnViewEnter } from "./OnViewEnter";

import { useQuery, useQueryInvalidation } from "@/common/api";
import type { MethodPath } from "@/common/api/client";
import { useRefreshControl } from "@/common/refresh";

// 🙏
type PaginatedPath = keyof {
  [P in MethodPath<"get"> as NonNullable<
    ReturnType<typeof useQuery<P>>["data"]
  > extends { items?: unknown[] }
    ? NonNullable<Parameters<typeof useQuery<P>>[0]> extends {
        params: { query?: { limit?: number; offset?: number } };
      }
      ? P
      : never
    : never]: P;
};
type PaginatedArg<P extends PaginatedPath> = NonNullable<
  Parameters<typeof useQuery<P>>[0]
>;
type PaginatedItem<P extends PaginatedPath> = NonNullable<
  ReturnType<typeof useQuery<P>>["data"]
> extends { items?: (infer Item)[] | undefined }
  ? Item
  : never;
type QueryArg<P extends PaginatedPath> = Omit<PaginatedArg<P>, "params"> & {
  params: Omit<PaginatedArg<P>["params"], "query">;
};

type PaginatedScrollViewProps<P extends PaginatedPath> = {
  renderer: (item: PaginatedItem<P>) => ReactNode;
  query: QueryArg<P> | null;
  itemsPerPage: number;
  invalidationUrl: string | null;
};

type PageProps<P extends PaginatedPath> = {
  renderer: (item: PaginatedItem<P>) => ReactNode;
  query: QueryArg<P> | null;
  index: number;
  size: number;
  loadMore: () => void;
};

export const PaginatedScrollView = <P extends PaginatedPath>({
  renderer,
  query,
  itemsPerPage,
  invalidationUrl,
}: PaginatedScrollViewProps<P>) => {
  const [fragCount, setFragCount] = useState(1);
  const invalidateReminders = useQueryInvalidation(invalidationUrl);
  const refreshControl = useRefreshControl(invalidateReminders);

  return (
    <IOScrollView refreshControl={refreshControl}>
      {Array.from({ length: fragCount }).map((_, i) => (
        <Page
          key={i}
          index={i}
          size={itemsPerPage}
          renderer={renderer}
          query={query}
          loadMore={() => setFragCount((c) => Math.max(c, i + 2))}
        />
      ))}
    </IOScrollView>
  );
};

const Page = <P extends PaginatedPath>({
  renderer,
  query,
  index,
  size,
  loadMore,
}: PageProps<P>) => {
  const { data } = useQuery<P>(
    query
      ? ({
          ...query,
          params: {
            ...query.params,
            query: {
              limit: size,
              offset: index * size,
            },
          },
        } as PaginatedArg<P>)
      : null,
  ) as {
    data: { items: PaginatedItem<P>[] } | undefined;
  };

  if (!data || !data.items) {
    return <ActivityIndicator />;
  }

  return (
    <>
      {data.items.map((item, idx) => (
        <Fragment key={idx}>{renderer(item)}</Fragment>
      ))}
      <OnViewEnter handler={loadMore} disabled={data?.items?.length !== size} />
    </>
  );
};

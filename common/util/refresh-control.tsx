import { useCallback, useState } from "react";
import { RefreshControl } from "react-native";

export const useRefreshControl = (handler: () => Promise<void>) => {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await handler();
    setRefreshing(false);
  }, [handler]);

  return <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />;
};

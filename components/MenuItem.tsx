import { List } from "react-native-paper";

import { Action, useActionContext } from "@/common/actions";
import { useI18n } from "@/common/i18n";

type MenuItemProps = {
  action: Action;
};

export const MenuItem = ({ action }: MenuItemProps) => {
  const { t } = useI18n();
  const ctx = useActionContext();

  if (!ctx || action.hidden?.(ctx)) {
    return null;
  }

  return (
    <List.Item
      title={action.displayName(t)}
      left={(props) => <List.Icon {...props} icon={action.icon} />}
      onPress={() => action.handler(ctx)}
    />
  );
};

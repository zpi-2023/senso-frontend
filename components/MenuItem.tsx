import { List } from "react-native-paper";

import { Action, ActionContext } from "@/common/actions";
import { useI18n } from "@/common/i18n";

type MenuItemProps = {
  action: Action;
  ctx: ActionContext;
};

export const MenuItem = ({ action, ctx }: MenuItemProps) => {
  const { t } = useI18n();
  return (
    <List.Item
      title={action.displayName(t)}
      left={(props) => <List.Icon {...props} icon={action.icon} />}
      onPress={() => action.handler(ctx)}
    />
  );
};

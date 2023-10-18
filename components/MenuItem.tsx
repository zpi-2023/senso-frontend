import { List, useTheme } from "react-native-paper";

import { Action, useActionContext } from "@/common/actions";
import { useI18n } from "@/common/i18n";
import { isCaretaker } from "@/common/identity";

type MenuItemProps = {
  action: Action;
};

export const MenuItem = ({ action }: MenuItemProps) => {
  const { t } = useI18n();
  const theme = useTheme();
  const ctx = useActionContext();

  if (!ctx || action.hidden?.(ctx)) {
    return null;
  }

  const isManaged = isCaretaker(ctx.identity.profile) && action.managed;
  const color = isManaged ? theme.colors.primary : theme.colors.onBackground;

  return (
    <List.Item
      title={action.displayName(t)}
      left={(props) => (
        <List.Icon {...props} icon={action.icon} color={color} />
      )}
      onPress={() => action.handler(ctx)}
      right={
        isManaged
          ? (props) => (
              <List.Icon {...props} icon="account-wrench" color={color} />
            )
          : undefined
      }
      titleStyle={{ color }}
    />
  );
};

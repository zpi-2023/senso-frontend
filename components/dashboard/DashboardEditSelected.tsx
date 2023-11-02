import { StyleSheet } from "react-native";
import { IconButton, List, useTheme } from "react-native-paper";

import { ActionKey, actions } from "@/common/actions";
import { useI18n } from "@/common/i18n";

type DashboardEditSelectedProps = {
  gadget: ActionKey;
  isFirst: boolean;
  isLast: boolean;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
};

export const DashboardEditSelected = ({
  gadget,
  isFirst,
  isLast,
  onRemove,
  onMoveUp,
  onMoveDown,
}: DashboardEditSelectedProps) => {
  const { t } = useI18n();
  const theme = useTheme();

  return (
    <List.Item
      left={(props) => (
        <List.Icon
          {...props}
          icon={actions[gadget].icon}
          color={theme.colors.primary}
        />
      )}
      title={actions[gadget].displayName(t)}
      titleStyle={{ color: theme.colors.primary }}
      right={() => (
        <>
          <IconButton
            icon="chevron-up"
            size={16}
            style={[styles.button, isFirst ? styles.disabled : null]}
            disabled={isFirst}
            onPress={onMoveUp}
          />
          <IconButton
            icon="window-close"
            iconColor="#E57373"
            size={16}
            style={styles.button}
            onPress={onRemove}
          />
          <IconButton
            icon="chevron-down"
            size={16}
            style={[styles.button, isLast ? styles.disabled : null]}
            disabled={isLast}
            onPress={onMoveDown}
          />
        </>
      )}
    />
  );
};

const styles = StyleSheet.create({
  button: {
    marginVertical: 0,
    transform: [{ scale: 1.5 }],
  },
  disabled: {
    opacity: 0,
  },
});
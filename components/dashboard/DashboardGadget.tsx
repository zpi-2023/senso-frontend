import { StyleSheet } from "react-native";
import { Card, IconButton, Text, TouchableRipple } from "react-native-paper";

import { View } from "../Themed";

import { Action, useActionContext } from "@/common/actions";
import { useI18n } from "@/common/i18n";

type DashboardGadgetProps = {
  action: Action;
  inactive?: boolean;
};

export const DashboardGadget = ({ action, inactive }: DashboardGadgetProps) => {
  const { t } = useI18n();
  const ctx = useActionContext();

  if (!ctx) {
    return null;
  }

  const hidden = action.hidden?.(ctx) ?? false;
  const disabled = hidden || inactive;

  return (
    <View style={styles.wrapper}>
      <Card style={hidden ? styles.hidden : undefined}>
        <View style={styles.boundary}>
          <TouchableRipple
            onPress={disabled ? undefined : () => action.handler(ctx)}
            disabled={disabled}
          >
            <View style={styles.inner}>
              <IconButton icon={action.icon} size={64} />
              <Text>{action.displayName(t)}</Text>
            </View>
          </TouchableRipple>
        </View>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    maxWidth: "50%",
    padding: 16,
  },
  boundary: {
    borderRadius: 12,
    backgroundColor: "transparent",
    overflow: "hidden",
  },
  inner: {
    aspectRatio: 1,
    backgroundColor: "transparent",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  hidden: {
    opacity: 0.5,
  },
});

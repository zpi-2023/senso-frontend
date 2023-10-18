import { StyleSheet } from "react-native";
import { Card, IconButton, Text, TouchableRipple } from "react-native-paper";

import { View } from "./Themed";

import { Action, useActionContext } from "@/common/actions";
import { useI18n } from "@/common/i18n";

type DashboardGadgetProps = {
  action: Action;
};

export const DashboardGadget = ({ action }: DashboardGadgetProps) => {
  const { t } = useI18n();
  const ctx = useActionContext();

  return (
    <View style={styles.wrapper}>
      <Card>
        <View style={styles.boundary}>
          <TouchableRipple
            onPress={
              ctx && !action.hidden?.(ctx)
                ? () => action.handler(ctx)
                : undefined
            }
            disabled={ctx ? action.hidden?.(ctx) : true}
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
});

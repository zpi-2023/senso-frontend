import { View } from "react-native";
import { Card, Text, TouchableRipple } from "react-native-paper";

import { type Action, useActionContext } from "@/common/actions";
import { useI18n } from "@/common/i18n";
import { sty } from "@/common/styles";
import { Icon } from "@/components";

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
            <View style={[styles.inner, sty.center]}>
              <Icon icon={action.icon} size={64} />
              <Text>{action.displayName(t)}</Text>
            </View>
          </TouchableRipple>
        </View>
      </Card>
    </View>
  );
};

const styles = sty.create({
  wrapper: {
    flex: 1,
    maxWidth: "50%",
    padding: 16,
  },
  boundary: {
    borderRadius: 12,
    overflow: "hidden",
  },
  inner: {
    aspectRatio: 1,
  },
  hidden: {
    opacity: 0.5,
  },
});

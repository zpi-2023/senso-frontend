import { StyleSheet } from "react-native";
import { FAB } from "react-native-paper";

import { actions, useActionContext } from "@/common/actions";
import { useI18n } from "@/common/i18n";

const action = actions.activateSos;

export const SosFab = () => {
  const { t } = useI18n();
  const ctx = useActionContext();

  if (!ctx || action.hidden(ctx)) {
    return null;
  }

  return (
    <FAB
      icon={action.icon}
      style={styles.fab}
      onPress={() => action.handler(ctx)}
      label={action.displayName(t)}
    />
  );
};

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: 32,
    right: 32,
    backgroundColor: "#991b1b",
  },
});

import { useState } from "react";
import { StyleSheet } from "react-native";
import { FAB, Modal, Portal, Text } from "react-native-paper";

import SosSlider from "./SosSlider";

import { actions, useActionContext } from "@/common/actions";
import { useI18n } from "@/common/i18n";

const action = actions.activateSos;

export const SosFab = () => {
  const { t } = useI18n();
  const [visible, setVisible] = useState(false);
  const ctx = useActionContext();

  if (!ctx || action.hidden(ctx)) {
    return null;
  }

  const handleOpen = () => setVisible(true);
  const handleClose = () => setVisible(false);

  return (
    <>
      <FAB
        icon={action.icon}
        style={styles.fab}
        onPress={handleOpen}
        label={action.displayName(t)}
      />
      <Portal>
        <Modal
          visible={visible}
          onDismiss={handleClose}
          contentContainerStyle={{
            padding: 30,
            margin: 20,
            borderRadius: 10,
            height: 200,
            backgroundColor: "green",
          }}
        >
          <Text variant="headlineLarge" style={{ textAlign: "center" }}>
            Slide to call for help
          </Text>
          <SosSlider />
        </Modal>
      </Portal>
    </>
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

import { useState } from "react";
import { StyleSheet } from "react-native";
import {
  FAB,
  type MD3Theme,
  Modal,
  Portal,
  Text,
  useTheme,
} from "react-native-paper";

import SosSlider from "./SosSlider";

import { actions, useActionContext } from "@/common/actions";
import { colors } from "@/common/constants";
import { useI18n } from "@/common/i18n";

const action = actions.activateSos;

export const SosFab = () => {
  const { t } = useI18n();
  const theme = useTheme();
  const styles = makeStyles(theme);
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
          contentContainerStyle={styles.contentContainerStyle}
        >
          <Text variant="headlineLarge" style={{ textAlign: "center" }}>
            {t("sosSlider.description")}
          </Text>
          <SosSlider />
        </Modal>
      </Portal>
    </>
  );
};

const makeStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    contentContainerStyle: {
      padding: 30,
      margin: 20,
      borderRadius: 10,
      height: 200,
      backgroundColor: theme.colors.background,
    },
    fab: {
      position: "absolute",
      bottom: 32,
      right: 32,
      backgroundColor: colors.error,
    },
  });

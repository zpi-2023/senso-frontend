import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Button, Dialog, Portal, Text } from "react-native-paper";

import { useMutation, useQueryInvalidation } from "@/common/api";
import { AppRoutes } from "@/common/constants";
import { useI18n } from "@/common/i18n";

type ReminderDeactivateDialogProps = {
  reminderId: number;
  visible: boolean;
  dismissDialog: () => void;
};

const ReminderDeactivateDialog = ({
  reminderId,
  visible,
  dismissDialog,
}: ReminderDeactivateDialogProps) => {
  const { t } = useI18n();
  const router = useRouter();

  const deactivateReminder = useMutation(
    "delete",
    "/api/v1/reminders/{reminderId}",
  );
  const invalidateReminders = useQueryInvalidation("/api/v1/reminders");

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={dismissDialog}>
        <Dialog.Title>{t("medication.deactivateDialog.title")}</Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyLarge">
            {t("medication.deactivateDialog.description")}
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={dismissDialog}>{t("dialog.cancel")}</Button>
          <Button
            onPress={async () => {
              dismissDialog();
              router.push(AppRoutes.MedicationList);
              await deactivateReminder({ params: { path: { reminderId } } });
              await invalidateReminders();
            }}
          >
            {t("dialog.confirm")}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export const useReminderDeactivateDialog = (reminderId: number | null) => {
  const [visible, setVisible] = useState(false);
  const showDialog = useCallback(() => setVisible(true), []);
  const dismissDialog = useCallback(() => setVisible(false), []);

  const dialog = reminderId ? (
    <ReminderDeactivateDialog
      reminderId={reminderId}
      visible={visible}
      dismissDialog={dismissDialog}
    />
  ) : null;

  return { dialog, showDialog };
};

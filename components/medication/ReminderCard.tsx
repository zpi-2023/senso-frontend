import { router } from "expo-router";
import { useState, type ComponentProps } from "react";
import { Button, Card, IconButton, Menu, Text } from "react-native-paper";

import { useReminderDeactivateDialog } from "./ReminderDeactivateDialog";

import { AppRoutes } from "@/common/constants";
import { useI18n } from "@/common/i18n";
import { sty } from "@/common/styles";
import { formatCron } from "@/common/time";
import { canMakeQuickIntake, type Reminder } from "@/logic/medication";

type ReminderCardProps = {
  reminder: Reminder;
} & Pick<ComponentProps<typeof Card>, "style">;

export const ReminderCard = ({ reminder, ...props }: ReminderCardProps) => {
  const { t } = useI18n();
  const [menuVisible, setMenuVisible] = useState(false);
  const { showDialog: showDeactivateDialog, dialog: deactivateDialog } =
    useReminderDeactivateDialog(reminder.id);

  return (
    <Card
      {...props}
      style={[
        props.style,
        styles.card,
        reminder.isActive ? null : styles.inactive,
      ]}
      onPress={() =>
        router.push({
          pathname: AppRoutes.ReminderDetails,
          params: { reminderId: reminder.id, tab: "details" },
        })
      }
    >
      <Card.Title
        title={`${reminder.medicationName} - ${reminder.amountPerIntake} ${
          reminder.amountUnit ?? t("medication.pills")
        }`}
        right={(props) =>
          reminder.isActive ? (
            <Menu
              {...props}
              visible={menuVisible}
              onDismiss={() => setMenuVisible(false)}
              anchor={
                <IconButton
                  icon="dots-vertical"
                  onPress={() => setMenuVisible(true)}
                />
              }
            >
              <Menu.Item
                onPress={() => setMenuVisible(false)}
                leadingIcon="pencil"
                title={t("medication.list.editReminder")}
              />
              <Menu.Item
                onPress={() => {
                  setMenuVisible(false);
                  showDeactivateDialog();
                }}
                leadingIcon="bell-off-outline"
                title={t("medication.list.deactivateReminder")}
              />
            </Menu>
          ) : null
        }
        subtitle={
          reminder.cron ? formatCron(reminder.cron, new Date(), t) : null
        }
        titleVariant="titleLarge"
        subtitleVariant="titleMedium"
      />
      <Card.Content>
        {reminder.description ? (
          <Text variant="bodyLarge">{reminder.description}</Text>
        ) : null}
      </Card.Content>
      <Card.Actions>
        {canMakeQuickIntake(reminder, new Date()) ? (
          <Button mode="contained" onPress={() => {}} icon="pill">
            {t("medication.takeDose")}
          </Button>
        ) : null}
        <Button
          mode="outlined"
          onPress={() =>
            router.push({
              pathname: AppRoutes.ReminderDetails,
              params: { reminderId: reminder.id, tab: "history" },
            })
          }
          icon="history"
        >
          {t("medication.list.history")}
        </Button>
      </Card.Actions>
      {deactivateDialog}
    </Card>
  );
};

const styles = sty.create({
  card: {
    paddingVertical: 8,
  },
  inactive: {
    opacity: 0.5,
  },
});

import { useState, type ComponentProps } from "react";
import { Button, Card, IconButton, Menu, Text } from "react-native-paper";

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

  return (
    <Card
      {...props}
      style={[
        props.style,
        styles.card,
        reminder.isActive ? null : styles.inactive,
      ]}
    >
      <Card.Title
        title={`${reminder.medicationName} - ${reminder.amountPerIntake} ${
          reminder.amountUnit ?? t("medicationList.pills")
        }`}
        right={(props) => (
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
              title={t("medicationList.editReminder")}
            />
            <Menu.Item
              onPress={() => setMenuVisible(false)}
              leadingIcon="bell-off-outline"
              title={t("medicationList.deactivateReminder")}
            />
          </Menu>
        )}
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
            {t("medicationList.takeDose")}
          </Button>
        ) : null}
        <Button mode="outlined" onPress={() => {}} icon="history">
          {t("medicationList.history")}
        </Button>
      </Card.Actions>
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

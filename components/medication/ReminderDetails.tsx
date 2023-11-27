import { View } from "react-native";
import { FAB, Text } from "react-native-paper";

import { useI18n } from "@/common/i18n";
import { sty } from "@/common/styles";
import { nextOccurences } from "@/common/time";
import type { Reminder } from "@/logic/medication";

type SegmentProps = {
  label: string;
  value: string;
  right?: true | undefined;
};

const Segment = ({ label, value, right }: SegmentProps) => {
  const style = right ? { textAlign: "right" as const } : null;
  return (
    <View>
      <Text variant="titleLarge" style={style}>
        {label}
      </Text>
      <Text variant="bodyLarge" style={style}>
        {value}
      </Text>
    </View>
  );
};

type ReminderDetailsProps = {
  reminder: Reminder;
  canTake: boolean;
};

export const ReminderDetails = ({
  reminder,
  canTake,
}: ReminderDetailsProps) => {
  const { t, language } = useI18n();
  return (
    <View style={styles.view}>
      <Segment
        label={t("medication.details.medicationName")}
        value={reminder.medicationName}
      />
      {reminder.cron ? (
        <Segment
          label={t("medication.details.nextReminders")}
          value={nextOccurences(reminder.cron, 3)
            .map(
              (date) =>
                `• ${date.toLocaleString([language], {
                  month: "long",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}`,
            )
            .join("\n")}
        />
      ) : null}
      {reminder.description ? (
        <Segment
          label={t("medication.details.description")}
          value={reminder.description}
        />
      ) : null}
      <View style={styles.row}>
        <Segment
          label={t("medication.details.amountPerIntake")}
          value={`${reminder.amountPerIntake} ${
            reminder.amountUnit ?? t("medication.pills")
          }`}
        />
        <Segment
          right
          label={t("medication.details.amountOwned")}
          value={`${reminder.amountOwned} ${
            reminder.amountUnit ?? t("medication.pills")
          }${
            reminder.medicationAmountInPackage
              ? `\n(${reminder.medicationAmountInPackage} ${t(
                  "medication.details.inPackage",
                )})`
              : ""
          }`}
        />
      </View>
      {canTake ? (
        <FAB
          style={styles.fab}
          icon="pill"
          onPress={() => {}}
          label={t("medication.takeDose")}
        />
      ) : null}
    </View>
  );
};

const styles = sty.create({
  view: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    display: "flex",
    flexDirection: "column",
    gap: 16,
    flex: 1,
  },
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  fab: {
    position: "absolute",
    right: 32,
    bottom: 32,
  },
});

import { useRouter } from "expo-router";
import { List } from "react-native-paper";

import { AppRoutes } from "@/common/constants";
import { useI18n } from "@/common/i18n";
import { formatShortOffset } from "@/common/time";
import { type Intake } from "@/logic/medication";

type IntakeEntryProps = {
  intake: Intake;
  navigable?: boolean;
};

export const IntakeEntry = ({ intake, navigable }: IntakeEntryProps) => {
  const { t } = useI18n();
  const router = useRouter();

  return (
    <List.Item
      title={`${intake.medicationName} - ${intake.formatAmountTaken(t)}`}
      description={formatShortOffset(intake.takenAt, t)}
      left={(props) => <List.Icon {...props} icon="pill" />}
      onPress={
        navigable
          ? () =>
              router.push({
                pathname: AppRoutes.ReminderDetails,
                params: { reminderId: intake.reminderId, tab: "history" },
              })
          : undefined
      }
    />
  );
};

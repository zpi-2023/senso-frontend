import { List } from "react-native-paper";

import { useI18n } from "@/common/i18n";
import { formatShortOffset } from "@/common/time";
import { formatAmount, type Intake } from "@/logic/medication";

type IntakeEntryProps = {
  intake: Intake;
};

export const IntakeEntry = ({ intake }: IntakeEntryProps) => {
  const { t } = useI18n();

  return (
    <List.Item
      title={`${intake.medicationName} - ${formatAmount(
        intake.amountTaken,
        intake.amountUnit,
        t,
      )}`}
      description={formatShortOffset(intake.takenAt, t)}
      left={(props) => <List.Icon {...props} icon="pill" />}
    />
  );
};

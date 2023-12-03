import { IntakeEntry } from "./IntakeEntry";

import { PaginatedScrollView } from "@/components";
import { Intake } from "@/logic/medication";

type ReminderHistoryProps = {
  reminderId: number;
};

export const ReminderHistory = ({ reminderId }: ReminderHistoryProps) => {
  return (
    <PaginatedScrollView
      renderer={(data) => <IntakeEntry intake={Intake.fromData(data)} />}
      query={{
        url: "/api/v1/intakes/reminder/{reminderId}",
        params: { path: { reminderId } },
      }}
      itemsPerPage={5}
      invalidationUrl="/api/v1/reminders"
    />
  );
};

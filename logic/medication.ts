import { useLocalSearchParams } from "expo-router";

export type Reminder = {
  id: number;
  seniorId: number;
  medicationName: string;
  medicationAmountInPackage?: number | null;
  isActive: boolean;
  amountPerIntake: number;
  amountOwned?: number | null;
  amountUnit?: string | null;
  cron?: string | null;
  description?: string | null;
};

export const useReminderIdParam = (): number | null => {
  const { reminderId: reminderIdString } = useLocalSearchParams<{
    reminderId: string;
  }>();
  const noteId = reminderIdString ? parseInt(reminderIdString, 10) : null;
  return Number.isNaN(noteId) ? null : noteId;
};

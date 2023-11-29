import { useLocalSearchParams } from "expo-router";

export const useReminderParams = (): {
  reminderId: number | null;
  tab: "details" | "history";
} => {
  const { reminderId: reminderIdString, tab: tabString } =
    useLocalSearchParams<{
      reminderId: string;
      tab?: "details" | "history";
    }>();
  const reminderId = reminderIdString ? parseInt(reminderIdString, 10) : null;
  const tab = tabString ?? "details";
  return { reminderId, tab };
};

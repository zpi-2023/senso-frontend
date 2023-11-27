import { parseExpression } from "cron-parser";
import { useLocalSearchParams } from "expo-router";

import type { Translator } from "@/common/i18n";

const quickIntakeThresholdMs = 1000 * 60 * 5;

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

export const canMakeQuickIntake = (reminder: Reminder, now: Date) => {
  if (!reminder.isActive) {
    return false;
  }

  if (!reminder.cron) {
    return true;
  }

  const expr = parseExpression(reminder.cron);
  const tillPrev = now.getTime() - expr.prev().toDate().getTime();
  const tillNext = expr.next().toDate().getTime() - now.getTime();

  return Math.min(tillPrev, tillNext) < quickIntakeThresholdMs;
};

export const formatAmount = (
  amount: number,
  unit: string | null | undefined,
  t: Translator,
) => (unit ? `${amount} ${unit}` : t("medication.pills", { count: amount }));

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

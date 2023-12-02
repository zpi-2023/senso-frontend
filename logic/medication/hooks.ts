import { useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";

import type { Reminder } from "./reminder";

import { useMutation, useQueryInvalidation } from "@/common/api";

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

export const useCreateIntake = ({
  reminder,
  amount,
  time,
}: {
  reminder: Reminder;
  amount?: number;
  time?: Date;
}) => {
  const [loading, setLoading] = useState(false);
  const mutation = useMutation("post", "/api/v1/intakes/reminder/{reminderId}");
  const invalidate = useQueryInvalidation("/api/v1/intakes");

  const create = useCallback(async () => {
    setLoading(true);
    await mutation({
      params: { path: { reminderId: reminder.id } },
      body: {
        amountTaken: amount ?? reminder.amountPerIntake,
        takenAt: (time ?? new Date()).toISOString(),
      },
    });
    await invalidate();
    setLoading(false);
  }, [
    mutation,
    invalidate,
    reminder.id,
    amount,
    reminder.amountPerIntake,
    time,
  ]);

  return { create, loading };
};

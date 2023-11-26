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

export const useMedicationIdParam = (): number | null => {
  const { medicationId: medicationIdString } = useLocalSearchParams<{
    medicationId: string;
  }>();
  const noteId = medicationIdString ? parseInt(medicationIdString, 10) : null;
  return Number.isNaN(noteId) ? null : noteId;
};

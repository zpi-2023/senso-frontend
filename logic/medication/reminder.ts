import { quickIntakeThresholdMs } from "./consts";

import type { Translator } from "@/common/i18n";
import { Cron } from "@/common/time";

export type ReminderData = {
  id: number;
  seniorId: number;
  medicationName: string;
  medicationAmountInPackage?: number | null | undefined;
  isActive: boolean;
  amountPerIntake: number;
  amountOwned?: number | null | undefined;
  amountUnit?: string | null | undefined;
  cron?: string | null | undefined;
  description?: string | null | undefined;
};

export type ReminderCreateData = Omit<
  ReminderData,
  "id" | "seniorId" | "isActive"
>;

export type ReminderEditData = Omit<
  ReminderCreateData,
  "medicationName" | "medicationAmountInPackage" | "amountUnit"
>;

export class Reminder {
  public static fromData(data: ReminderData): Reminder {
    return new Reminder(
      data.id,
      data.medicationName,
      data.medicationAmountInPackage ?? null,
      data.isActive,
      data.amountPerIntake,
      data.amountOwned ?? null,
      data.amountUnit ?? null,
      data.cron ? new Cron(data.cron) : null,
      data.description ?? null,
    );
  }

  private static formatAmount(
    amount: number,
    unit: string | null,
    t: Translator,
  ): string {
    return `${amount} ${unit ?? t("medication.pills", { count: amount })}`;
  }

  private constructor(
    public readonly id: number,
    public readonly medicationName: string,
    public readonly medicationAmountInPackage: number | null,
    public readonly isActive: boolean,
    public readonly amountPerIntake: number,
    private readonly amountOwned: number | null,
    private readonly amountUnit: string | null,
    public readonly cron: Cron | null,
    public readonly description: string | null,
  ) {}

  public formatAmountPerIntake(t: Translator): string {
    return Reminder.formatAmount(this.amountPerIntake, this.amountUnit, t);
  }

  public formatAmountOwned(t: Translator): string {
    return Reminder.formatAmount(this.amountOwned ?? 0, this.amountUnit, t);
  }

  public title(t: Translator): string {
    return `${this.medicationName} - ${this.formatAmountPerIntake(t)}`;
  }

  public canMakeQuickIntake(): boolean {
    if (!this.isActive) {
      return false;
    }

    if (!this.cron) {
      return true;
    }

    const tillPrev = Date.now() - this.cron.prevDate().getTime();
    const tillNext = this.cron.nextDate().getTime() - Date.now();
    return Math.min(tillPrev, tillNext) < quickIntakeThresholdMs;
  }
}

import type { Translator } from "@/common/i18n";

type IntakeData = {
  id: number;
  reminderId: number;
  medicationName: string;
  takenAt: string;
  amountTaken: number;
  amountUnit?: string | null | undefined;
};

export class Intake {
  public static fromData(data: IntakeData): Intake {
    return new Intake(
      data.id,
      data.reminderId,
      data.medicationName,
      new Date(data.takenAt),
      data.amountTaken,
      data.amountUnit ?? null,
    );
  }

  private constructor(
    private readonly id: number,
    private readonly reminderId: number,
    public readonly medicationName: string,
    public readonly takenAt: Date,
    private readonly amountTaken: number,
    private readonly amountUnit: string | null,
  ) {}

  public formatAmountTaken(t: Translator): string {
    return this.amountUnit
      ? `${this.amountTaken} ${this.amountUnit}`
      : t("medication.pills", { count: this.amountTaken });
  }
}

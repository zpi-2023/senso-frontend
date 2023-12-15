import { type CronExpression, parseExpression } from "cron-parser";

import { dayInMins } from "./consts";
import { formatShortOffset } from "./offset";
import { getTzMinuteDiff } from "./timezone";

import type { Translator } from "@/common/i18n";
import { parseNum } from "@/common/parsing";

export class Cron {
  public static fromLocalString(localCron: string): Cron | null {
    try {
      return new Cron(localCron, parseExpression(localCron));
    } catch {
      return null;
    }
  }

  public static fromUtcString(utcCron: string): Cron | null {
    const localCron = Cron.offsetCronString(utcCron, -getTzMinuteDiff());
    if (localCron) {
      return Cron.fromLocalString(localCron);
    }
    return null;
  }

  private static offsetCronString(
    beforeCron: string,
    offsetMinutes: number,
  ): string | null {
    const beforeParts = beforeCron.split(" ");
    const beforeMin = parseNum(beforeParts[0] ?? "");
    const beforeHour = parseNum(beforeParts[1] ?? "");
    if (beforeMin === null || beforeHour === null) {
      return null;
    }
    const beforeTotalMins = beforeHour * 60 + beforeMin;

    const afterTotalMins = mod(beforeTotalMins + offsetMinutes, dayInMins);
    const afterHour = Math.floor(afterTotalMins / 60);
    const afterMin = afterTotalMins % 60;

    return `${afterMin} ${afterHour} * * *`;
  }

  private constructor(
    private readonly localSource: string,
    private readonly expression: CronExpression,
  ) {}

  public get localString(): string {
    return this.localSource;
  }

  public get utcString(): string {
    return Cron.offsetCronString(this.localSource, +getTzMinuteDiff())!;
  }

  public nextDate(): Date {
    const next = this.expression.next();
    this.expression.reset();
    return next.toDate();
  }

  public prevDate(): Date {
    const prev = this.expression.prev();
    this.expression.reset();
    return prev.toDate();
  }

  public incomingEvents(count: number): Date[] {
    const result = [];
    for (let i = 0; i < count; i++) {
      result.push(this.expression.next().toDate());
    }
    this.expression.reset();
    return result;
  }

  public formatNearestEvent(t: Translator): string {
    const prevDate = this.prevDate();
    const nextDate = this.nextDate();
    const tillPrev = Date.now() - prevDate.getTime();
    const tillNext = nextDate.getTime() - Date.now();
    return formatShortOffset(tillPrev < tillNext ? prevDate : nextDate, t);
  }
}

const mod = (a: number, b: number): number => ((a % b) + b) % b;

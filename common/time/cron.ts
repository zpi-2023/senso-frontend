import { type CronExpression, parseExpression } from "cron-parser";

import { dayInMins } from "./consts";
import { formatShortOffset } from "./offset";
import { getTzMinuteDiff } from "./timezone";

import type { Translator } from "@/common/i18n";
import { parseNum } from "@/common/parsing";

export class Cron {
  public static fromUtcString(utcCron: string): Cron | null {
    const utcParts = utcCron.split(" ");
    const utcMin = parseNum(utcParts[0] ?? "");
    const utcHour = parseNum(utcParts[1] ?? "");

    if (utcMin === null || utcHour === null) {
      return null;
    }

    const utcTotalMins = utcHour * 60 + utcMin;
    const localTotalMins = mod(utcTotalMins - getTzMinuteDiff(), dayInMins);
    const localHour = Math.floor(localTotalMins / 60);
    const localMin = localTotalMins % 60;

    return Cron.fromLocalString(`${localMin} ${localHour} * * *`);
  }

  public static fromLocalString(localCron: string): Cron | null {
    try {
      return new Cron(parseExpression(localCron), localCron);
    } catch {
      return null;
    }
  }

  private constructor(
    private readonly expression: CronExpression,
    private readonly source: string,
  ) {}

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

import { type CronExpression, parseExpression } from "cron-parser";

import { formatShortOffset } from "./offset";

import type { Translator } from "@/common/i18n";

export class Cron {
  private readonly expression: CronExpression;

  public constructor(cron: string) {
    this.expression = parseExpression(cron);
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

import { parseExpression } from "cron-parser";

import type { Translator } from "@/common/i18n";

const dayInMs = 1000 * 60 * 60 * 24;

export const toMinutesAndSeconds = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  const minutesStr = String(minutes).padStart(2, "0");
  const secondsStr = String(seconds).padStart(2, "0");

  return `${minutesStr}:${secondsStr}`;
};

export const formatDateOffset = (date: Date, now: Date, t: Translator) => {
  const daysAgo = Math.trunc((now.getTime() - date.getTime()) / dayInMs);

  switch (daysAgo) {
    case 0:
      return t("time.today");
    case 1:
      return t("time.yesterday");
    default:
      return date.toISOString().split("T")[0];
  }
};

export const nextOccurences = (cron: string, count: number): Date[] => {
  const expression = parseExpression(cron);
  const result = [];
  for (let i = 0; i < count && expression.hasNext(); i++) {
    result.push(expression.next().toDate());
  }
  return result;
};

const formatDuration = (diffMs: number, t: Translator): string => {
  const diffMins = Math.ceil(diffMs / 1000 / 60);

  if (diffMins >= 60) {
    return `${Math.round(diffMins / 60)} ${t("time.hours")}`;
  } else {
    return `${diffMins} ${t("time.minutes")}`;
  }
};

export const formatCron = (cron: string, now: Date, t: Translator): string => {
  const expr = parseExpression(cron);
  const prevDate = expr.prev().toDate();
  const nextDate = expr.next().toDate();
  const tillPrev = now.getTime() - prevDate.getTime();
  const tillNext = nextDate.getTime() - now.getTime();

  if (tillPrev < tillNext) {
    return `${formatDuration(tillPrev, t)} ${t("time.ago")}`;
  } else {
    return `${t("time.in")} ${formatDuration(tillNext, t)}`;
  }
};

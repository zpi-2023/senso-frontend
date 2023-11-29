import { dayInMs } from "./consts";

import type { Translator } from "@/common/i18n";

const summarizeDuration = (diffMs: number): [number, "hours" | "minutes"] => {
  const diffMins = Math.ceil(diffMs / 1000 / 60);

  if (diffMins >= 60) {
    return [Math.round(diffMins / 60), "hours"];
  } else {
    return [diffMins, "minutes"];
  }
};

export const formatShortOffset = (
  date: Date,
  t: Translator,
  now: Date = new Date(),
): string => {
  const diffMs = date.getTime() - now.getTime();

  if (diffMs < 0) {
    const [count, unit] = summarizeDuration(-diffMs);
    return unit === "hours"
      ? t("time.hoursAgo", { count })
      : t("time.minutesAgo", { count });
  } else {
    const [count, unit] = summarizeDuration(diffMs);
    return unit === "hours"
      ? t("time.inHours", { count })
      : t("time.inMinutes", { count });
  }
};

export const formatLongOffset = (
  date: Date,
  t: Translator,
  now: Date = new Date(),
): string => {
  const daysAgo = Math.trunc((now.getTime() - date.getTime()) / dayInMs);

  switch (daysAgo) {
    case 0:
      return t("time.today");
    case 1:
      return t("time.yesterday");
    default:
      return date.toISOString().split("T")[0]!;
  }
};

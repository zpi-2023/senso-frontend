import type { Translator } from "../common/i18n";

const DAY_IN_MS = 1000 * 60 * 60 * 24;

export const toMinutesAndSeconds = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  const minutesStr = String(minutes).padStart(2, "0");
  const secondsStr = String(seconds).padStart(2, "0");

  return `${minutesStr}:${secondsStr}`;
};

export const formatDateOffset = (date: Date, now: Date, t: Translator) => {
  const daysAgo = Math.trunc((now.getTime() - date.getTime()) / DAY_IN_MS);

  switch (daysAgo) {
    case 0:
      return t("time.today");
    case 1:
      return t("time.yesterday");
    default:
      return date.toISOString().split("T")[0];
  }
};

import type { Translator } from "@/common/i18n";
import {
  formatLongOffset,
  formatShortOffset,
  toMinutesAndSeconds,
} from "@/common/time";

const mockDate = new Date("2022-04-12T13:18:30.000Z");

const mockTranslator: Translator = (key, substs?: { count?: number }) => {
  const s = substs?.count === 1 ? "" : "s";
  switch (key) {
    case "time.today":
      return "Today";
    case "time.yesterday":
      return "Yesterday";
    case "time.inHours":
      return `in ${substs?.count} hour${s}`;
    case "time.inMinutes":
      return `in ${substs?.count} minute${s}`;
    case "time.hoursAgo":
      return `${substs?.count} hour${s} ago`;
    case "time.minutesAgo":
      return `${substs?.count} minute${s} ago`;
    default:
      throw new Error(`Unexpected key: ${key}`);
  }
};

describe("Time", () => {
  describe(toMinutesAndSeconds, () => {
    it.each([
      [0, "00:00"],
      [3, "00:03"],
      [59, "00:59"],
      [60, "01:00"],
      [97, "01:37"],
      [599, "09:59"],
      [600, "10:00"],
      [3599, "59:59"],
    ])("formats %d seconds left correctly", (totalSeconds, expected) => {
      expect(toMinutesAndSeconds(totalSeconds)).toBe(expected);
    });
  });

  describe(formatShortOffset, () => {
    it("returns past time in hours", () => {
      expect(
        formatShortOffset(
          new Date("2022-04-12T12:00:00.000Z"),
          mockTranslator,
          mockDate,
        ),
      ).toBe("1 hour ago");
    });

    it("returns past time in minutes", () => {
      expect(
        formatShortOffset(
          new Date("2022-04-12T13:15:00.000Z"),
          mockTranslator,
          mockDate,
        ),
      ).toBe("4 minutes ago");
    });

    it("returns future time in hours", () => {
      expect(
        formatShortOffset(
          new Date("2022-04-12T15:30:00.000Z"),
          mockTranslator,
          mockDate,
        ),
      ).toBe("in 2 hours");
    });

    it("returns future time in minutes", () => {
      expect(
        formatShortOffset(
          new Date("2022-04-12T13:23:00.000Z"),
          mockTranslator,
          mockDate,
        ),
      ).toBe("in 5 minutes");
    });
  });

  describe(formatLongOffset, () => {
    it("returns special text for today", () => {
      expect(
        formatLongOffset(
          new Date("2022-04-12T10:12:00.000Z"),
          mockTranslator,
          mockDate,
        ),
      ).toBe("Today");
      expect(
        formatLongOffset(
          new Date("2022-04-12T01:50:00.000Z"),
          mockTranslator,
          mockDate,
        ),
      ).toBe("Today");
    });

    it("returns special text for yesterday", () => {
      expect(
        formatLongOffset(
          new Date("2022-04-11T11:21:37.000Z"),
          mockTranslator,
          mockDate,
        ),
      ).toBe("Yesterday");
      expect(
        formatLongOffset(
          new Date("2022-04-11T01:13:22.000Z"),
          mockTranslator,
          mockDate,
        ),
      ).toBe("Yesterday");
    });

    it("returns an ISO date for old dates", () => {
      expect(
        formatLongOffset(
          new Date("2022-04-03T15:05:10.000Z"),
          mockTranslator,
          mockDate,
        ),
      ).toBe("2022-04-03");
    });
  });
});

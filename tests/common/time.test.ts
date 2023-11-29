import type { Translator } from "@/common/i18n";
import { formatPastDayOffset, toMinutesAndSeconds } from "@/common/time";

const mockDate = new Date("2022-04-12T13:18:30.000Z");

const mockTranslator: Translator = (key) => {
  switch (key) {
    case "time.today":
      return "Today";
    case "time.yesterday":
      return "Yesterday";
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

  describe(formatPastDayOffset, () => {
    it("returns special text for today", () => {
      expect(
        formatPastDayOffset(
          new Date("2022-04-12T10:12:00.000Z"),
          mockDate,
          mockTranslator,
        ),
      ).toBe("Today");
      expect(
        formatPastDayOffset(
          new Date("2022-04-12T01:50:00.000Z"),
          mockDate,
          mockTranslator,
        ),
      ).toBe("Today");
    });

    it("returns special text for yesterday", () => {
      expect(
        formatPastDayOffset(
          new Date("2022-04-11T11:21:37.000Z"),
          mockDate,
          mockTranslator,
        ),
      ).toBe("Yesterday");
      expect(
        formatPastDayOffset(
          new Date("2022-04-11T01:13:22.000Z"),
          mockDate,
          mockTranslator,
        ),
      ).toBe("Yesterday");
    });

    it("returns an ISO date for old dates", () => {
      expect(
        formatPastDayOffset(
          new Date("2022-04-03T15:05:10.000Z"),
          mockDate,
          mockTranslator,
        ),
      ).toBe("2022-04-03");
    });
  });
});

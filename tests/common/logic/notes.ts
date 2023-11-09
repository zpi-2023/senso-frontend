import type { Translator } from "@/common/i18n";
import { formatNoteCreationDate, summarizeNote } from "@/common/logic";

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

describe(formatNoteCreationDate, () => {
  it("returns special text for today", () => {
    expect(
      formatNoteCreationDate(
        "2022-04-12T10:12:00.000Z",
        mockDate,
        mockTranslator,
      ),
    ).toBe("Today");
  });

  it("returns special text for yesterday", () => {
    expect(
      formatNoteCreationDate(
        "2022-04-11T18:21:37.000Z",
        mockDate,
        mockTranslator,
      ),
    ).toBe("Yesterday");
  });

  it("returns an ISO date for old dates", () => {
    expect(
      formatNoteCreationDate(
        "2022-04-03T15:05:10.000Z",
        mockDate,
        mockTranslator,
      ),
    ).toBe("2022-04-03");
  });
});

describe(summarizeNote, () => {
  it("uses title if present", () => {
    expect(
      summarizeNote({
        id: 1,
        content: "Hello world!",
        createdAt: "2022-04-12T10:12:00.000Z",
        isPrivate: false,
        title: "Hello",
      }),
    ).toBe({ title: "Hello", summary: "Hello world!" });
  });

  it("uses entire content if title is missing and content is short", () => {
    expect(
      summarizeNote({
        id: 1,
        content: "Hello",
        createdAt: "2022-04-12T10:12:00.000Z",
        isPrivate: false,
      }),
    ).toBe({ title: "Hello", summary: "" });
  });

  it("uses part of content if title is missing and content is long", () => {
    expect(
      summarizeNote({
        id: 1,
        content:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam pretium mi risus.",
        createdAt: "2022-08-01T03:11:00.000Z",
        isPrivate: true,
      }),
    ).toBe({
      title: "Lorem ipsum dolor si...",
      summary: "...t amet, consectetur adipiscing elit. Nam pretium mi risus.",
    });
  });
});

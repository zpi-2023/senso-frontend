import { summarizeNote, notePageTitle } from "@/logic/notes";

describe("Notes", () => {
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
      ).toStrictEqual({ title: "Hello", summary: "Hello world!" });
    });

    it("uses entire content if title is missing and content is short", () => {
      expect(
        summarizeNote({
          id: 1,
          content: "Hello",
          createdAt: "2022-04-12T10:12:00.000Z",
          isPrivate: false,
        }),
      ).toStrictEqual({ title: "Hello", summary: "" });
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
      ).toStrictEqual({
        title: "Lorem ipsum dolor si...",
        summary:
          "...t amet, consectetur adipiscing elit. Nam pretium mi risus.",
      });
    });
  });

  describe(notePageTitle, () => {
    it("uses title if present", () => {
      expect(
        notePageTitle({
          id: 13,
          title: "Title",
          content: "Hello",
          createdAt: "2022-04-12T10:12:00.000Z",
          isPrivate: true,
        }),
      ).toBe("Title");
    });

    it("uses entire content if title is missing and content is short", () => {
      expect(
        notePageTitle({
          id: 1,
          content: "Hello",
          createdAt: "2022-04-12T10:12:00.000Z",
          isPrivate: false,
        }),
      ).toBe("Hello");
    });

    it("uses part of content if title is missing and content is long", () => {
      expect(
        notePageTitle({
          id: 1,
          content:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam pretium mi risus.",
          createdAt: "2022-08-01T03:11:00.000Z",
          isPrivate: true,
        }),
      ).toBe("Lorem ipsum dolor si...");
    });
  });
});

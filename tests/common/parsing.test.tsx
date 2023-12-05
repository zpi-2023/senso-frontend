import { parseNum } from "@/common/parsing";

describe(parseNum, () => {
  it.each([
    ["10", 10],
    ["-1", -1],
    ["0", 0],
    ["50", 50],
  ])("parses %p correctly", (str, num) => {
    expect(parseNum(str)).toBe(num);
  });

  it.each(["abcd", "", "te123st"])("returns null for %p", (str) => {
    expect(parseNum(str)).toBe(null);
  });
});

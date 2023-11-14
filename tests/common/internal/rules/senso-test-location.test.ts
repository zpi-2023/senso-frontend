import { ruleTester } from "./ruleTester";

import sensoTestLocation from "@/common/internal/rules/senso-test-location";

const errors = [{ message: "Jest can only be used in test files." }];

ruleTester.run("senso-test-location", sensoTestLocation, {
  valid: [
    {
      code: "it('works', () => {});",
      filename: "/tests/example.test.ts",
    },
    {
      code: "describe('feature', () => { it('works', () => {}) });",
      filename: "/tests/deeply/nested/myTestFile.test.tsx",
    },
  ],
  invalid: [
    {
      code: "it('test', () => {})",
      filename: "/app/index.tsx",
      errors,
    },
    {
      code: "it.each([])('example', () => {})",
      filename: "/tests/i-forgot-the-suffix.ts",
      errors,
    },
    {
      code: "describe('feature', () => {})",
      filename: "/outside-of-directory.test.js",
      errors,
    },
  ],
});

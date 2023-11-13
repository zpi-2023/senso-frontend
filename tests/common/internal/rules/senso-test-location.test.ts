import { ruleTester } from "./ruleTester";

import sensoTestLocation from "@/common/internal/rules/senso-test-location";

const errors = [{ message: "Jest can only be used in test files." }];

ruleTester.run("senso-test-location", sensoTestLocation, {
  valid: [
    {
      code: "it('works', () => {});",
      filename: "/projects/senso/tests/example.test.ts",
    },
    {
      code: "describe('feature', () => { it('works', () => {}) });",
      filename: "/home/senso-frontend/tests/deeply/nested/myTestFile.test.tsx",
    },
  ],
  invalid: [
    {
      code: "it('test', () => {})",
      filename: "/projects/senso/app/index.tsx",
      errors,
    },
    {
      code: "it.each([])('example', () => {})",
      filename: "/home/senso-frontend/tests/i-forgot-the-suffix.ts",
      errors,
    },
    {
      code: "describe('feature', () => {})",
      filename: "/home/senso-frontend/outside-of-directory.test.js",
      errors,
    },
  ],
});

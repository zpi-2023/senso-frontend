import { RuleTester } from "eslint";

export const ruleTester = new RuleTester({
  parserOptions: { ecmaVersion: "latest", ecmaFeatures: { jsx: true } },
});

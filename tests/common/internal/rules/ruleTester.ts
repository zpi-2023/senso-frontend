import { RuleTester } from "eslint";

const cwd = process.cwd();
process.chdir("/");
export const ruleTester = new RuleTester({
  parser: require.resolve("@typescript-eslint/parser"),
  parserOptions: {
    ecmaVersion: "latest",
    ecmaFeatures: { jsx: true },
    sourceType: "module",
  },
});
process.chdir(cwd);

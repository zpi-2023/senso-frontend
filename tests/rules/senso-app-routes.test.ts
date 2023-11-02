import { RuleTester } from "eslint";

import rule from "@/rules/senso-app-routes";

const tester = new RuleTester({
  parserOptions: { ecmaVersion: "latest", ecmaFeatures: { jsx: true } },
});

const errors = [
  { message: "You should use the `AppRoutes` enum for all routes." },
];

tester.run("senso-app-routes", rule, {
  valid: [
    { code: "router.push(AppRoutes.Menu)" },
    { code: "router.replace(AppRoutes.Dashboard)" },
    { code: "const link = <Link href={AppRoutes.ProfileList}>Test</Link>" },
  ],
  invalid: [
    {
      code: "router.push('/menu')",
      errors,
    },
    {
      code: "router.replace(`/${'dashboard'}`)",
      errors,
    },
    {
      code: "const link = <Link href='/profile/list'>Test</Link>",
      errors,
    },
  ],
});

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
    { code: "<Link href={AppRoutes.ProfileList}>Test</Link>" },
    {
      code: "<Link href={{ pathname: AppRoutes.NoteDetails, params: { noteId: 0 } }}>Test</Link>",
    },
    {
      code: "router.push({ pathname: AppRoutes.NoteDetails, params: { noteId: 0 } })",
    },
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
    {
      code: "const link = <Link href={{ pathname: '/notes' }}>Test</Link>",
      errors,
    },
    {
      code: "router.push({ pathname: '/notes/[noteId]', params: { noteId: 0 } })",
      errors,
    },
  ],
});

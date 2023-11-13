import { RuleTester } from "eslint";

import rule from "@/common/internal/rules/senso-app-routes";

const tester = new RuleTester({
  parserOptions: { ecmaVersion: "latest", ecmaFeatures: { jsx: true } },
});

const errors = [
  {
    message:
      "You should use the `AppRoutes` enum for all routes.\nThe enum is accessible via `@/common/constants`.",
  },
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
    {
      code: "router.push(true ? AppRoutes.ExampleTrue : AppRoutes.ExampleFalse)",
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
    {
      code: "router.push(true ? '/notes' : AppRoutes.NoteDetails)",
      errors,
    },
    {
      code: "router.push(true ? { pathname: '/' } : AppRoutes.Notes)",
      errors,
    },
  ],
});

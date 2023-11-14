import { ruleTester } from "./ruleTester";

import sensoExportPolicy from "@/common/internal/rules/senso-export-policy";

const errorsAll = [
  {
    message: "Barrel exports are not allowed, list all identifiers explicitly.",
  },
];
const errorsNamed = [
  {
    message:
      "Named exports are not allowed in the `app` directory, use default exports instead.",
  },
];
const errorsDefault = [
  {
    message:
      "Default exports are not allowed outside of the `app` directory, use named exports instead.",
  },
];

ruleTester.run("senso-export-policy", sensoExportPolicy, {
  valid: [
    {
      code: "export default Page;",
      filename: "/app/index.tsx",
    },
    {
      code: "export default function Example() {}",
      filename: "/app/notes/create.tsx",
    },
    {
      code: "export { NoteForm };",
      filename: "/components/notes/NoteForm.tsx",
    },
    {
      code: "export const Landing = () => {};",
      filename: "/components/home/Landing.tsx",
    },
    {
      code: "export { colors } from './colors';",
      filename: "/common/constants/index.ts",
    },
  ],
  invalid: [
    {
      code: "export * from './colors';",
      filename: "/common/constants/index.ts",
      errors: errorsAll,
    },
    {
      code: "export * from './index';",
      filename: "/app/index.tsx",
      errors: errorsAll,
    },
    {
      code: "export const Page = () => {};",
      filename: "/app/index.tsx",
      errors: errorsNamed,
    },
    {
      code: "export { Page };",
      filename: "/app/dashboard/index.tsx",
      errors: errorsNamed,
    },
    {
      code: "export default function Landing() {}",
      filename: "/components/home/Landing.tsx",
      errors: errorsDefault,
    },
    {
      code: "export default NoteForm;",
      filename: "/components/notes/NoteForm.tsx",
      errors: errorsDefault,
    },
    {
      code: "export default POST;",
      filename: "/common/api/index.ts",
      errors: errorsDefault,
    },
  ],
});

import { ruleTester } from "./ruleTester";

import sensoParentImport from "@/common/internal/rules/senso-parent-import";

const expectedResult = (specifiers: string, expectedImport: string) => ({
  errors: [
    {
      message: `Relative imports from parent directories are not allowed, import \`${expectedImport}\` instead.`,
    },
  ],
  output: `import ${specifiers} from "${expectedImport}";`,
});

ruleTester.run("senso-parent-import", sensoParentImport, {
  valid: [
    {
      code: "import { test } from './relative';",
      filename: "/logic/notes.ts",
    },
    {
      code: "import something from '@/common';",
      filename: "/components/notes/NoteForm.tsx",
    },
    {
      code: "import { View } from 'react-native';",
      filename: "/app/index.tsx",
    },
  ],
  invalid: [
    {
      code: "import { test } from '../common';",
      filename: "/logic/notes.ts",
      ...expectedResult("{ test }", "@/common"),
    },
    {
      code: "import { Icon } from '../Icon';",
      filename: "/components/notes/NoteForm.tsx",
      ...expectedResult("{ Icon }", "@/components/Icon"),
    },
    {
      code: "import type { ActionKey } from '../common/actions';",
      filename: "/logic/dashboard.ts",
      ...expectedResult("type { ActionKey }", "@/common/actions"),
    },
    {
      code: "import type { Translator } from '../common/i18n';",
      filename: "/common/time.ts",
      ...expectedResult("type { Translator }", "@/common/i18n"),
    },
  ],
});

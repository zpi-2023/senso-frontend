import { ruleTester } from "./ruleTester";

import sensoImportSources from "@/common/internal/rules/senso-import-sources";

ruleTester.run("senso-import-sources", sensoImportSources, {
  valid: [{ code: "import { useTheme } from '@/common/theme';" }],
  invalid: [
    {
      code: "import { useTheme } from 'react-native-paper';",
      errors: [
        {
          message:
            "The identifier `useTheme` must always be imported from `@/common/theme`.",
        },
      ],
    },
  ],
});

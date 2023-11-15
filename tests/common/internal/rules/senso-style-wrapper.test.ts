import { ruleTester } from "./ruleTester";

import sensoStyleWrapper from "@/common/internal/rules/senso-style-wrapper";

ruleTester.run("senso-style-wrapper", sensoStyleWrapper, {
  valid: [
    { code: "const styles = sty.create({ highlighted: { color: 'red' } });" },
    {
      code: "const useStyles = sty.themedHook(({ colors }) => ({ highlighted: { color: colors.primary } }));",
    },
  ],
  invalid: [
    {
      code: "const styles = StyleSheet.create({ highlighted: { color: 'red' } });",
      errors: [
        {
          message:
            "Use `sty.create` or `sty.themedHook` from `@/common/styles` instead.",
        },
      ],
    },
  ],
});

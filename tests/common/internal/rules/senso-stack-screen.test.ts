import { ruleTester } from "./ruleTester";

import sensoStackScreen from "@/common/internal/rules/senso-stack-screen";

ruleTester.run("senso-stack-screen", sensoStackScreen, {
  valid: [{ code: "<Header title='Home' />" }],
  invalid: [
    {
      code: "<Stack.Screen name='Home' />",
      errors: [
        {
          message:
            "Illegal use of `Stack.Screen`.\nUse `Header` from `@/components` instead.",
        },
      ],
    },
  ],
});

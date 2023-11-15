import type { useRouter } from "expo-router";
import type { ComponentProps } from "react";

import type { I18n, Translator } from "@/common/i18n";
import type { IdentityProfileKnown } from "@/common/identity/types";
import type { Icon } from "@/components";

type IconSource = ComponentProps<typeof Icon>["icon"];
type Router = ReturnType<typeof useRouter>;

export type ActionContext = {
  identity: IdentityProfileKnown;
  router: Router;
  i18n: I18n;
};

export type Action = {
  displayName: (t: Translator) => string;
  icon: IconSource;
  handler: (ctx: ActionContext) => void;
  hidden?: (ctx: ActionContext) => boolean;
  managed?: true;
};

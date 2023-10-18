import type { useRouter } from "expo-router";
import type { ComponentProps } from "react";
import type { IconButton } from "react-native-paper";

import type { Translator } from "../i18n";
import type { IdentityProfileKnown } from "../identity/types";

type IconSource = ComponentProps<typeof IconButton>["icon"];
type Router = ReturnType<typeof useRouter>;

export type ActionContext = {
  identity: IdentityProfileKnown;
  router: Router;
};

export type Action = {
  displayName: (t: Translator) => string;
  icon: IconSource;
  handler: (ctx: ActionContext) => void;
};

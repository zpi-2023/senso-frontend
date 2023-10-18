import { useRouter } from "expo-router";

import type { ActionContext } from "./types";
import { useI18n } from "../i18n";
import { useIdentity } from "../identity";

export const useActionContext = (): ActionContext | null => {
  const identity = useIdentity();
  const router = useRouter();
  const i18n = useI18n();

  if (!identity.hasProfile) {
    return null;
  }

  return { identity, router, i18n };
};

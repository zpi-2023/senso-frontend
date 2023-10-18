import { useRouter } from "expo-router";

import type { ActionContext } from "./types";
import { useIdentity } from "../identity";

export const useActionContext = (): ActionContext | null => {
  const identity = useIdentity();
  const router = useRouter();

  if (!identity.hasProfile) {
    return null;
  }

  return { identity, router };
};

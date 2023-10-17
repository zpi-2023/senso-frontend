import type { Action } from "./types";

export const actions = {
  profileList: {
    displayName: (t) => t("actions.profileList"),
    icon: "account-switch",
    handler: ({ router }) => router.push("/profile/list"),
  },
  logOut: {
    displayName: (t) => t("actions.logOut"),
    icon: "account-arrow-right",
    handler: ({ identity }) => identity.logOut(),
  },
} satisfies Record<string, Action>;

import type { Action } from "./types";
import { AppRoutes } from "../util/constants";

export const actions = {
  profileList: {
    displayName: (t) => t("actions.profileList"),
    icon: "account-switch",
    handler: ({ router }) => router.push(AppRoutes.ProfileList),
  },
  logOut: {
    displayName: (t) => t("actions.logOut"),
    icon: "account-arrow-right",
    handler: ({ identity }) => identity.logOut(),
  },
} satisfies Record<string, Action>;

export type ActionKey = keyof typeof actions;

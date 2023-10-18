import type { Action } from "./types";

export const actions = {
  goBack: {
    displayName: (t) => t("actions.goBack"),
    icon: "arrow-left",
    handler: ({ router }) => router.back(),
    hidden: ({ router }) => !router.canGoBack(),
  },
  openMenu: {
    displayName: (t) => t("actions.openMenu"),
    icon: "menu",
    handler: ({ router }) => router.push("/menu"),
  },
  switchProfile: {
    displayName: (t) => t("actions.profileList"),
    icon: "account-switch",
    handler: ({ router }) => router.push("/profile/list"),
  },
  logOut: {
    displayName: (t) => t("actions.logOut"),
    icon: "account-arrow-right",
    handler: ({ identity }) => identity.logOut(),
  },
  activateSos: {
    displayName: (t) => t("actions.activateSos"),
    icon: "alarm-light",
    handler: (_) => {
      /* TODO */
    },
  },
} satisfies Record<string, Action>;

export type ActionKey = keyof typeof actions;

import type { Action } from "./types";
import { isCaretaker, isSenior } from "../identity";

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
  openDashboard: {
    displayName: (t) => t("actions.openDashboard"),
    icon: "view-dashboard",
    handler: ({ router }) => router.push("/dashboard"),
    hidden: ({ identity }) => isSenior(identity.profile),
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
    hidden: ({ identity }) => isCaretaker(identity.profile),
  },
  pairCaretaker: {
    displayName: (t) => t("actions.pairCaretaker"),
    icon: "link-variant-plus",
    handler: ({ router }) => router.push("/profile/scan_seniorqr"),
    hidden: ({ identity }) => isCaretaker(identity.profile),
  },
  editDashboard: {
    displayName: (t) => t("actions.editDashboard"),
    icon: "view-dashboard-edit",
    handler: (_) => {
      /* TODO */
    },
  },
  changeLanguage: {
    displayName: (t) => t("actions.changeLanguage"),
    icon: "translate",
    handler: (_) => {
      /* TODO */
    },
  },
  trackMedication: {
    displayName: (t) => t("actions.trackMedication"),
    icon: "medical-bag",
    handler: (_) => {
      /* TODO */
    },
  },
  playGames: {
    displayName: (t) => t("actions.playGames"),
    icon: "gamepad-variant",
    handler: (_) => {
      /* TODO */
    },
    hidden: ({ identity }) => isCaretaker(identity.profile),
  },
  manageNotes: {
    displayName: (t) => t("actions.manageNotes"),
    icon: "note-edit",
    handler: (_) => {
      /* TODO */
    },
  },
} satisfies Record<string, Action>;

export type ActionKey = keyof typeof actions;

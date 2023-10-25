import type { Action } from "./types";
import { isCaretaker, isSenior } from "../identity";
import { AppRoutes } from "../util/constants";

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
    managed: true,
  },
  switchProfile: {
    displayName: (t) => t("actions.profileList"),
    icon: "account-switch",
    handler: ({ router }) => router.push(AppRoutes.ProfileList),
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
  showSosHistory: {
    displayName: (t) => t("actions.showSosHistory"),
    icon: "account-alert",
    handler: ({ router }) => router.push("/sos-history"),
    hidden: ({ identity }) => isSenior(identity.profile),
    managed: true,
  },
  pairCaretaker: {
    displayName: (t) => t("actions.pairCaretaker"),
    icon: "link-variant-plus",
    handler: ({ router }) => router.push(AppRoutes.DisplaySeniorQR),
    hidden: ({ identity }) => isCaretaker(identity.profile),
  },
  editDashboard: {
    displayName: (t) => t("actions.editDashboard"),
    icon: "view-dashboard-edit",
    handler: ({ router }) => router.push("/dashboard/edit"),
    managed: true,
  },
  toggleLanguage: {
    displayName: (t) => t("actions.toggleLanguage"),
    icon: "translate",
    handler: ({ i18n }) => i18n.toggleLanguage(),
  },
  trackMedication: {
    displayName: (t) => t("actions.trackMedication"),
    icon: "medical-bag",
    handler: ({ router }) => router.push("/medication"),
    managed: true,
  },
  playGames: {
    displayName: (t) => t("actions.playGames"),
    icon: "gamepad-variant",
    handler: ({ router }) => router.push("/games"),
    hidden: ({ identity }) => isCaretaker(identity.profile),
  },
  manageNotes: {
    displayName: (t) => t("actions.manageNotes"),
    icon: "note-edit",
    handler: ({ router }) => router.push("/notes"),
    managed: true,
  },
} satisfies Record<string, Action>;

export type ActionKey = keyof typeof actions;

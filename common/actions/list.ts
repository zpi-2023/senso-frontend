import type { Action } from "./types";

import { AppRoutes } from "@/common/constants";
import { isCaretaker, isSenior } from "@/common/identity";

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
    handler: ({ router }) => router.push(AppRoutes.Menu),
  },
  openDashboard: {
    displayName: (t) => t("actions.openDashboard"),
    icon: "view-dashboard",
    handler: ({ router }) => router.push(AppRoutes.Dashboard),
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
    displayName: (t) => t("actions.showAlertHistory"),
    icon: "account-alert",
    handler: ({ router }) => router.push(AppRoutes.AlertHistory),
    hidden: ({ identity }) => isSenior(identity.profile),
    managed: true,
  },
  viewCaretakerList: {
    displayName: (t) => t("actions.viewCaretakerList"),
    icon: "account-details",
    handler: ({ router }) => router.push(AppRoutes.SeniorCaretakerList),
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
    handler: ({ router }) => router.push(AppRoutes.EditDashboard),
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
    handler: ({ router }) => router.push(AppRoutes.MedicationList),
    managed: true,
  },
  intakeHistory: {
    displayName: (t) => t("actions.intakeHistory"),
    icon: "history",
    handler: ({ router }) => router.push(AppRoutes.IntakeHistory),
    managed: true,
  },
  playGames: {
    displayName: (t) => t("actions.playGames"),
    icon: "gamepad-variant",
    handler: ({ router }) => router.push(AppRoutes.Games),
    hidden: ({ identity }) => isCaretaker(identity.profile),
  },
  playMemoryGame: {
    displayName: (t) => t("actions.playMemoryGame"),
    icon: "cards",
    handler: ({ router }) => router.push(AppRoutes.MemoryGame),
    hidden: ({ identity }) => isCaretaker(identity.profile),
  },
  playWordleGame: {
    displayName: (t) => t("actions.playWordleGame"),
    icon: "file-word-box",
    handler: ({ router }) => router.push(AppRoutes.GraydleGame),
    hidden: ({ identity }) => isCaretaker(identity.profile),
  },
  playSudokuGame: {
    displayName: (t) => t("actions.playSudokuGame"),
    icon: "apps",
    handler: ({ router }) => router.push(AppRoutes.SudokuGame),
    hidden: ({ identity }) => isCaretaker(identity.profile),
  },
  manageNotes: {
    displayName: (t) => t("actions.manageNotes"),
    icon: "note",
    handler: ({ router }) => router.push(AppRoutes.NoteList),
    managed: true,
  },
  quickCreateNote: {
    displayName: (t) => t("actions.quickCreateNote"),
    icon: "pencil-plus",
    handler: ({ router }) => router.push(AppRoutes.CreateNote),
    hidden: ({ identity }) => isCaretaker(identity.profile),
  },
} satisfies Record<string, Action>;

export type ActionKey = keyof typeof actions;

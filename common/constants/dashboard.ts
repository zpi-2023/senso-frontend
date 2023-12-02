import type { ActionKey } from "@/common/actions";

export const maxGadgets = 6;

export const availableGadgets = [
  "openMenu",
  "trackMedication",
  "playGames",
  "playMemoryGame",
  "playWordleGame",
  "manageNotes",
  "quickCreateNote",
  "switchProfile",
  "logOut",
  "pairCaretaker",
  "viewCaretakerList",
  "editDashboard",
  "toggleLanguage",
] satisfies ActionKey[];

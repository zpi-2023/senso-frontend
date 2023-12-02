import type { ActionKey } from "@/common/actions";

export const maxGadgets = 6;

export const availableGadgets = [
  "openMenu",
  "trackMedication",
  "playGames",
  "playMemoryGame",
  "manageNotes",
  "quickCreateNote",
  "switchProfile",
  "logOut",
  "pairCaretaker",
  "viewCaretakerList",
  "editDashboard",
  "toggleLanguage",
] satisfies ActionKey[];

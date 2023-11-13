import type { ActionKey } from "../actions";

export const maxGadgets = 6;

export const availableGadgets = [
  "openMenu",
  "trackMedication",
  "playGames",
  "manageNotes",
  "quickCreateNote",
  "switchProfile",
  "logOut",
  "pairCaretaker",
  "editDashboard",
  "toggleLanguage",
] satisfies ActionKey[];

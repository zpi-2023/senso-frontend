import type { ActionKey } from "../actions";

export const MAX_GADGETS = 6;

export const availableGadgets = [
  "openMenu",
  "trackMedication",
  "playGames",
  "manageNotes",
  "switchProfile",
  "logOut",
  "pairCaretaker",
  "editDashboard",
  "toggleLanguage",
] satisfies ActionKey[];

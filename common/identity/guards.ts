import type { Profile, SeniorProfile, CaretakerProfile } from "./types";

export const isSenior = (p: Profile): p is SeniorProfile => p.type === "senior";
export const isCaretaker = (p: Profile): p is CaretakerProfile =>
  p.type === "caretaker";

export type ProfileType = "caretaker" | "senior";

export interface IProfile {
  type: ProfileType;
  seniorId: string;
  seniorAlias?: string;
}

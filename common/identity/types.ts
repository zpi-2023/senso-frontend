type ProfileType = "senior" | "caretaker";

export type Profile = {
  type: ProfileType;
  /**
   * For `type` `"senior"`, this is the account ID of the current user.
   *
   * For `type` `"caretaker"`, this is the account ID of the senior which is taken care of (another user).
   */
  seniorId: number;
};

export type IdentityData =
  | { known: "nothing" }
  | { known: "account"; token: string }
  | { known: "profile"; token: string; profile: Profile };

export type LogIn = (token: string) => void;
export type LogOut = () => void;
export type SelectProfile = (profile: Profile) => void;

type IdentityNothingKnown = {
  isLoggedIn: false;
  hasProfile: false;
  logIn: LogIn;
};
type IdentityAccountKnown = {
  token: string;
  hasProfile: false;
  isLoggedIn: true;
  logOut: LogOut;
  selectProfile: SelectProfile;
};
type IdentityProfileKnown = {
  token: string;
  profile: Profile;
  hasProfile: true;
  isLoggedIn: true;
  logOut: LogOut;
  selectProfile: SelectProfile;
};

export type Identity =
  | IdentityNothingKnown
  | IdentityAccountKnown
  | IdentityProfileKnown;

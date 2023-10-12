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

type LoggedInIdentity = {
  token: string;
  isLoggedIn: true;
  logOut: LogOut;
  selectProfile: SelectProfile;
};

export type Identity =
  | { isLoggedIn: false; hasProfile: false; logIn: LogIn }
  | (LoggedInIdentity & { hasProfile: false })
  | (LoggedInIdentity & { hasProfile: true; profile: Profile });

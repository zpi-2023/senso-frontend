import type { AppRoutes } from "@/common/constants";

export type SeniorProfile = {
  type: "senior";
  /** For `type` `"senior"`, this is the account ID of the current user. */
  seniorId: number;
};

export type CaretakerProfile = {
  type: "caretaker";
  /** For `type` `"caretaker"`, this is the account ID of the senior which is taken care of (another user). */
  seniorId: number;
  /** Custom alias for a given senior's account, set by the current caretaker. */
  seniorAlias: string;
};

export type Profile = SeniorProfile | CaretakerProfile;

/**
 * State machine representing the current state of the user's identity.
 * This is only used internally, the consumer should use the `Identity` type.
 *
 * @see Identity
 */
export type IdentityData =
  | { known: "nothing" }
  | { known: "account"; accountId: number; token: string }
  | { known: "profile"; accountId: number; token: string; profile: Profile };

export type LogIn = (data: { accountId: number; token: string }) => void;
export type LogOut = () => void;
export type SelectProfile = (profile: Profile, redirectTo?: AppRoutes) => void;

export type IdentityNothingKnown = {
  isLoggedIn: false;
  hasProfile: false;
  logIn: LogIn;
};
export type IdentityAccountKnown = {
  accountId: number;
  token: string;
  hasProfile: false;
  isLoggedIn: true;
  logOut: LogOut;
  selectProfile: SelectProfile;
};
export type IdentityProfileKnown = {
  accountId: number;
  token: string;
  profile: Profile;
  hasProfile: true;
  isLoggedIn: true;
  logOut: LogOut;
  selectProfile: SelectProfile;
};

/**
 * Properties and methods available for the current user's identity.
 * The available methods depend on the current state of the user's identity.
 * They should be narrowed down using the `isLoggedIn` and `hasProfile` properties.
 */
export type Identity =
  | IdentityNothingKnown
  | IdentityAccountKnown
  | IdentityProfileKnown;

import { PropsWithChildren } from "react";

import { IdentityContext } from "./context";
import {
  IdentityAccountKnown,
  IdentityData,
  IdentityNothingKnown,
  IdentityProfileKnown,
} from "./types";
import { buildIdentity } from "./util";

/**
 * Used to enforce a specific identity in tests.
 *
 * @see useIdentity
 * @see IdentityProvider
 */
export const MockIdentityProvider = ({
  children,
  data,
}: PropsWithChildren<{ data: IdentityData }>) => (
  <IdentityContext.Provider value={{ data, setData: () => {} }}>
    {children}
  </IdentityContext.Provider>
);

const mockActions = {
  logIn: () => {},
  logOut: () => {},
  selectProfile: () => {},
};

export const mockIdentityLoggedOut = buildIdentity(
  { known: "nothing" },
  mockActions,
) as IdentityNothingKnown;

export const mockIdentityLoggedIn = buildIdentity(
  { known: "account", token: "TOKEN" },
  mockActions,
) as IdentityAccountKnown;

export const mockIdentityWithProfile = buildIdentity(
  {
    known: "profile",
    token: "TOKEN",
    profile: { type: "senior", seniorId: 1 },
  },
  mockActions,
) as IdentityProfileKnown;

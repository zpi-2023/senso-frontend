import { Redirect } from "expo-router";
import { FC } from "react";

import type { Identity } from "./types";

type RedirectProps = { identity: Identity };

class InvalidRedirectUsageError extends Error {
  constructor(component: FC<RedirectProps>) {
    super(`Invalid ${component.name} usage!`);
  }
}

/**
 * Redirects to the dashboard if the user is logged in and has a selected profile.
 *
 * Redirects to the profile selection page if the user is logged in but has no selected profile.
 *
 * Should be used inside a conditional to narrow the type of the identity object.
 *
 * @throws {InvalidRedirectUsageError} If the user is logged out.
 * @see RedirectIfNotLoggedIn
 * @see RedirectIfNotHasProfile
 */
export const RedirectIfNotLoggedOut = ({ identity }: RedirectProps) => {
  if (identity.hasProfile) {
    return <Redirect href="/dashboard" />;
  }
  if (identity.isLoggedIn) {
    return <Redirect href="/profiles/select" />;
  }
  throw new InvalidRedirectUsageError(RedirectIfNotLoggedOut);
};

/**
 * Redirects to the login page if the user is not logged in.
 *
 * Should be used inside a conditional to narrow the type of the identity object.
 *
 * @throws {InvalidRedirectUsageError} If the user is logged in.
 * @see RedirectIfNotLoggedOut
 * @see RedirectIfNotHasProfile
 */
export const RedirectIfNotLoggedIn = ({ identity }: RedirectProps) => {
  if (!identity.isLoggedIn) {
    return <Redirect href="/auth/login" />;
  }
  throw new InvalidRedirectUsageError(RedirectIfNotLoggedIn);
};

/**
 * Redirects to the login page if the user is not logged in.
 *
 * Redirects to the profile selection page if the user is logged in but has no selected profile.
 *
 * Should be used inside a conditional to narrow the type of the identity object.
 *
 * @throws {InvalidRedirectUsageError} If the user is logged out.
 * @see RedirectIfNotLoggedIn
 * @see RedirectIfNotLoggedOut
 */
export const RedirectIfNotHasProfile = ({ identity }: RedirectProps) => {
  if (!identity.isLoggedIn) {
    return <Redirect href="/auth/login" />;
  }
  if (!identity.hasProfile) {
    return <Redirect href="/profiles/select" />;
  }
  throw new InvalidRedirectUsageError(RedirectIfNotHasProfile);
};

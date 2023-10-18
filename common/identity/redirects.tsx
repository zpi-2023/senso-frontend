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
 * Redirects to the login page if the user is not logged in.
 *
 * Redirects to the profile selection page if the user is logged in but has no selected profile.
 *
 * Should be used inside a conditional to narrow the type of the identity object.
 *
 * @throws {InvalidRedirectUsageError} If the user is logged out.
 * @see RedirectIfLoggedOut
 * @see RedirectIfLoggedIn
 * @example
 * if (!identity.hasProfile) {
 *   return <RedirectIfNoProfile identity={identity} />;
 * }
 */
export const RedirectIfNoProfile = ({ identity }: RedirectProps) => {
  if (!identity.isLoggedIn) {
    return <Redirect href="/auth/login" />;
  }
  if (!identity.hasProfile) {
    return <Redirect href="/profile/list" />;
  }
  throw new InvalidRedirectUsageError(RedirectIfNoProfile);
};

/**
 * Redirects to the login page if the user is not logged in.
 *
 * Should be used inside a conditional to narrow the type of the identity object.
 *
 * @throws {InvalidRedirectUsageError} If the user is logged in.
 * @see RedirectIfLoggedIn
 * @see RedirectIfNoProfile
 * @example
 * if (!identity.isLoggedIn) {
 *   return <RedirectIfLoggedOut identity={identity} />;
 * }
 */
export const RedirectIfLoggedOut = ({ identity }: RedirectProps) => {
  if (!identity.isLoggedIn) {
    return <Redirect href="/auth/login" />;
  }
  throw new InvalidRedirectUsageError(RedirectIfLoggedOut);
};

/**
 * Redirects to the dashboard if the user is logged in and has a selected profile.
 *
 * Redirects to the profile selection page if the user is logged in but has no selected profile.
 *
 * Should be used inside a conditional to narrow the type of the identity object.
 *
 * @throws {InvalidRedirectUsageError} If the user is logged out.
 * @see RedirectIfLoggedOut
 * @see RedirectIfNoProfile
 * @example
 * if (identity.isLoggedIn) {
 *    return <RedirectIfLoggedIn identity={identity} />;
 * }
 */
export const RedirectIfLoggedIn = ({ identity }: RedirectProps) => {
  if (identity.hasProfile) {
    switch (identity.profile.type) {
      case "senior":
        return <Redirect href="/dashboard" />;
      case "caretaker":
        return <Redirect href="/menu" />;
    }
  }
  if (identity.isLoggedIn) {
    return <Redirect href="/profile/list" />;
  }
  throw new InvalidRedirectUsageError(RedirectIfLoggedIn);
};

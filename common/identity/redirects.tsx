import { Redirect } from "expo-router";
import type { FC } from "react";

import type { Identity } from "./types";
import { AppRoutes } from "../constants";

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
    return <Redirect href={AppRoutes.Login} />;
  }
  if (!identity.hasProfile) {
    return <Redirect href={AppRoutes.ProfileList} />;
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
    return <Redirect href={AppRoutes.Login} />;
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
        return <Redirect href={AppRoutes.Dashboard} />;
      case "caretaker":
        return <Redirect href={AppRoutes.Menu} />;
    }
  }
  if (identity.isLoggedIn) {
    return <Redirect href={AppRoutes.ProfileList} />;
  }
  throw new InvalidRedirectUsageError(RedirectIfLoggedIn);
};

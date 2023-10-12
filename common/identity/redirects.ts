import { useRouter } from "expo-router";
import { useEffect } from "react";

import { useIdentity } from "./context";
import type { Identity } from "./types";

const useRequire = (
  rule: (identity: Identity, router: ReturnType<typeof useRouter>) => void,
) => {
  const identity = useIdentity();
  const router = useRouter();
  useEffect(() => {
    rule(identity, router);
  }, [rule, identity, router]);
};

/**
 * Redirects to the dashboard if the user is logged in and has a selected profile.
 *
 * Redirects to the profile selection page if the user is logged in but has no selected profile.
 *
 * @see useRequireLoggedIn
 * @see useRequireHasProfile
 */
export const useRequireLoggedOut = () =>
  useRequire((identity, router) => {
    if (identity.hasProfile) {
      router.replace("/dashboard");
    } else if (identity.isLoggedIn) {
      router.replace("/profiles/select");
    }
  });

/**
 * Redirects to the login page if the user is not logged in.
 *
 * @see useRequireLoggedOut
 * @see useRequireHasProfile
 */
export const useRequireLoggedIn = () =>
  useRequire((identity, router) => {
    if (!identity.isLoggedIn) {
      router.replace("/auth/login");
    }
  });

/**
 * Redirects to the profile selection page if the user is logged in but has no selected profile.
 *
 * Redirects to the login page if the user is not logged in.
 *
 * @see useRequireLoggedIn
 * @see useRequireLoggedOut
 */
export const useRequireHasProfile = () =>
  useRequire((identity, router) => {
    if (!identity.hasProfile) {
      router.replace("/profiles/select");
    } else if (!identity.isLoggedIn) {
      router.replace("/auth/login");
    }
  });

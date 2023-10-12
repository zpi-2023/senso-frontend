import { useRouter } from "expo-router";
import { useEffect } from "react";

import { useIdentity } from "./context";

/**
 * Redirects to the dashboard if the user is logged in and has a selected profile.
 *
 * Redirects to the profile selection page if the user is logged in but has no selected profile.
 *
 * @see useRequireLoggedIn
 * @see useRequireHasProfile
 */
export const useRequireLoggedOut = () => {
  const router = useRouter();
  const identity = useIdentity();
  useEffect(() => {
    if (identity.hasProfile) {
      router.replace("/dashboard");
    } else if (identity.isLoggedIn) {
      router.replace("/profiles/select");
    }
  }, [router, identity]);
};

/**
 * Redirects to the login page if the user is not logged in.
 *
 * @see useRequireLoggedOut
 * @see useRequireHasProfile
 */
export const useRequireLoggedIn = () => {
  const router = useRouter();
  const identity = useIdentity();
  useEffect(() => {
    if (!identity.isLoggedIn) {
      router.replace("/auth/login");
    }
  }, [router, identity]);
};

/**
 * Redirects to the profile selection page if the user is logged in but has no selected profile.
 *
 * Redirects to the login page if the user is not logged in.
 *
 * @see useRequireLoggedIn
 * @see useRequireLoggedOut
 */
export const useRequireHasProfile = () => {
  const router = useRouter();
  const identity = useIdentity();
  useEffect(() => {
    if (!identity.hasProfile) {
      router.replace("/profiles/select");
    } else if (!identity.isLoggedIn) {
      router.replace("/auth/login");
    }
  }, [router, identity]);
};

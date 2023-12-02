import { render, renderHook, screen } from "@testing-library/react-native";
import type { ReactNode } from "react";
import { Text } from "react-native-paper";

import { AppRoutes } from "@/common/constants";
import {
  RedirectIfNoProfile,
  RedirectIfLoggedOut,
  RedirectIfLoggedIn,
  useIdentity,
} from "@/common/identity";
import {
  MockIdentityProvider,
  mockIdentityLoggedIn,
  mockIdentityLoggedOut,
  mockIdentityWithProfile,
} from "@/common/identity/mocks";
import type { IdentityData } from "@/common/identity/types";
import { MockRouter } from "@/common/router";

const renderUseIdentity = (data: IdentityData) =>
  renderHook(useIdentity, {
    wrapper: ({ children }) => (
      <MockIdentityProvider data={data}>{children}</MockIdentityProvider>
    ),
  }).result.current;

const testRedirect = async (
  initialRoute: string,
  redirect: ReactNode,
  targetRoute: string,
) => {
  const routes = [AppRoutes.Dashboard, AppRoutes.Login, AppRoutes.ProfileList];

  render(
    <MockRouter
      routes={{
        ...Object.fromEntries(
          routes.map((route) => [route, () => <Text>{route}</Text>]),
        ),
        [initialRoute]: () => redirect,
      }}
      initialRoute={initialRoute}
    />,
  );

  expect(await screen.findByText(targetRoute)).toBeVisible();
};

describe("Identity", () => {
  describe(useIdentity, () => {
    it("correctly reads logged out identity", () => {
      const identity = renderUseIdentity({ known: "nothing" });

      expect(identity.isLoggedIn).toBe(false);
      expect(identity.hasProfile).toBe(false);
    });

    it("correctly reads logged in identity", () => {
      const identity = renderUseIdentity({
        known: "account",
        accountId: 1,
        token: "TOKEN",
      });

      expect(identity.isLoggedIn).toBe(true);
      expect(identity.hasProfile).toBe(false);

      if (!identity.isLoggedIn) throw new Error();

      expect(identity.token).toBe("TOKEN");
    });

    it("correctly reads identity with profile", () => {
      const identity = renderUseIdentity({
        known: "profile",
        accountId: 1,
        token: "TOKEN",
        profile: { type: "senior", seniorId: 3 },
      });

      expect(identity.isLoggedIn).toBe(true);
      expect(identity.hasProfile).toBe(true);

      if (!identity.hasProfile) throw new Error();

      expect(identity.token).toBe("TOKEN");
      expect(identity.profile).toEqual({ type: "senior", seniorId: 3 });
    });
  });

  describe("Redirects", () => {
    describe(RedirectIfNoProfile, () => {
      it("redirects to the login page if the user is not logged in", () =>
        testRedirect(
          AppRoutes.Dashboard,
          <RedirectIfNoProfile identity={mockIdentityLoggedOut} />,
          AppRoutes.Login,
        ));

      it("redirects to the profile selection page if the user has no selected profile", () =>
        testRedirect(
          AppRoutes.Dashboard,
          <RedirectIfNoProfile identity={mockIdentityLoggedIn} />,
          AppRoutes.ProfileList,
        ));
    });

    describe(RedirectIfLoggedOut, () => {
      it("redirects to the login page if the user is not logged in", () =>
        testRedirect(
          AppRoutes.Dashboard,
          <RedirectIfLoggedOut identity={mockIdentityLoggedOut} />,
          AppRoutes.Login,
        ));
    });

    describe(RedirectIfLoggedIn, () => {
      it("redirects to the dashboard if the user is logged in and has a selected profile", () =>
        testRedirect(
          AppRoutes.Login,
          <RedirectIfLoggedIn identity={mockIdentityWithProfile} />,
          AppRoutes.Dashboard,
        ));

      it("redirects to the profile selection page if the user has no selected profile", () =>
        testRedirect(
          AppRoutes.Login,
          <RedirectIfLoggedIn identity={mockIdentityLoggedIn} />,
          AppRoutes.ProfileList,
        ));
    });
  });
});

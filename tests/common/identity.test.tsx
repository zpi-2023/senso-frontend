import { render, renderHook, screen } from "@testing-library/react-native";
import { ReactNode, useEffect } from "react";
import { Text } from "react-native";

import {
  IdentityProvider,
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
import { IdentityData } from "@/common/identity/types";
import { MockRouter } from "@/common/util";

const AutomaticLogin = () => {
  const identity = useIdentity();

  useEffect(() => {
    if (!identity.isLoggedIn) {
      identity.logIn("TOKEN");
    }
  }, [identity]);

  return <Text>{identity.isLoggedIn ? "LOGGED IN" : "LOGGED OUT"}</Text>;
};

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
  const routes = ["/dashboard", "/auth/login", "/profile/list"];

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
      const identity = renderUseIdentity({ known: "account", token: "TOKEN" });

      expect(identity.isLoggedIn).toBe(true);
      expect(identity.hasProfile).toBe(false);

      if (!identity.isLoggedIn) throw new Error();

      expect(identity.token).toBe("TOKEN");
    });

    it("correctly reads identity with profile", () => {
      const identity = renderUseIdentity({
        known: "profile",
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

  describe(IdentityProvider, () => {
    it("reacts to identity changes", async () => {
      render(<AutomaticLogin />, { wrapper: IdentityProvider });

      expect(await screen.findByText("LOGGED IN")).toBeVisible();
    });
  });

  describe("Redirects", () => {
    describe(RedirectIfNoProfile, () => {
      it("redirects to the login page if the user is not logged in", () =>
        testRedirect(
          "/dashboard",
          <RedirectIfNoProfile identity={mockIdentityLoggedOut} />,
          "/auth/login",
        ));

      it("redirects to the profile selection page if the user has no selected profile", () =>
        testRedirect(
          "/dashboard",
          <RedirectIfNoProfile identity={mockIdentityLoggedIn} />,
          "/profile/list",
        ));
    });

    describe(RedirectIfLoggedOut, () => {
      it("redirects to the login page if the user is not logged in", () =>
        testRedirect(
          "/dashboard",
          <RedirectIfLoggedOut identity={mockIdentityLoggedOut} />,
          "/auth/login",
        ));
    });

    describe(RedirectIfLoggedIn, () => {
      it("redirects to the dashboard if the user is logged in and has a selected profile", () =>
        testRedirect(
          "/auth/login",
          <RedirectIfLoggedIn identity={mockIdentityWithProfile} />,
          "/dashboard",
        ));

      it("redirects to the profile selection page if the user has no selected profile", () =>
        testRedirect(
          "/auth/login",
          <RedirectIfLoggedIn identity={mockIdentityLoggedIn} />,
          "/profile/list",
        ));
    });
  });
});

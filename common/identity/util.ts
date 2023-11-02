import type {
  Identity,
  IdentityData,
  LogIn,
  LogOut,
  SelectProfile,
} from "./types";

export const buildIdentity = (
  data: IdentityData,
  {
    logIn,
    logOut,
    selectProfile,
  }: { logIn: LogIn; logOut: LogOut; selectProfile: SelectProfile },
): Identity => {
  if (data.known === "nothing") {
    return { isLoggedIn: false, hasProfile: false, logIn };
  }

  const common = {
    token: data.token,
    isLoggedIn: true as const,
    logOut,
    selectProfile,
  };

  switch (data.known) {
    case "account":
      return {
        ...common,
        hasProfile: false,
      };
    case "profile":
      return {
        ...common,
        profile: data.profile,
        hasProfile: true,
      };
  }
};

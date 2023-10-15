export { useIdentity, IdentityProvider } from "./context";
export {
  RedirectIfNoProfile,
  RedirectIfLoggedOut,
  RedirectIfLoggedIn,
} from "./redirects";
export type {
  Identity,
  Profile,
  SeniorProfile,
  CaretakerProfile,
} from "./types";
export { isSenior, isCaretaker } from "./guards";

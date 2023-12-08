import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import "react-native-url-polyfill/auto";

import { I18nProvider } from "@/common/i18n";
import { IdentityProvider, useIdentity } from "@/common/identity";
import { ProviderList, useFontLoader, MaskingView } from "@/common/internal";
import {
  setExpoNotificationHandler,
  useDeviceRegistration,
} from "@/common/notifications";
import { ThemeProvider } from "@/common/theme";

// eslint-disable-next-line senso-export-policy -- special case for Expo
export { ErrorBoundary } from "expo-router";

SplashScreen.preventAutoHideAsync();
setExpoNotificationHandler();

export default function RootLayout() {
  const identity = useIdentity();
  const loaded = useFontLoader();
  const registerDevice = useDeviceRegistration();

  useEffect(() => {
    if (loaded && identity.isLoggedIn) {
      registerDevice(identity.token);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded, identity.isLoggedIn]);

  if (!loaded) {
    return null;
  }

  return (
    <ProviderList providers={[I18nProvider, IdentityProvider, ThemeProvider]}>
      <MaskingView>
        <Stack />
      </MaskingView>
    </ProviderList>
  );
}

import { SplashScreen, Stack } from "expo-router";
import "react-native-url-polyfill/auto";

import { I18nProvider } from "@/common/i18n";
import { IdentityProvider } from "@/common/identity";
import { ProviderList, useFontLoader, MaskingView } from "@/common/internal";
import {
  setExpoNotificationHandler,
  useExpoNotifications,
} from "@/common/notifications";
import { ThemeProvider } from "@/common/theme";

// eslint-disable-next-line senso-export-policy -- special case for Expo
export { ErrorBoundary } from "expo-router";

SplashScreen.preventAutoHideAsync();
setExpoNotificationHandler();

export default function RootLayout() {
  useExpoNotifications();
  const loaded = useFontLoader();
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

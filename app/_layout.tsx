import { SplashScreen, Stack } from "expo-router";

import { I18nProvider } from "@/common/i18n";
import { IdentityProvider } from "@/common/identity";
import {
  ProviderList,
  useFontLoader,
  ThemeProvider,
  MaskingView,
} from "@/common/internal";

export { ErrorBoundary } from "expo-router";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
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

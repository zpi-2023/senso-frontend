import { SplashScreen, Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";

import { I18nProvider } from "@/common/i18n";
import { IdentityProvider } from "@/common/identity";
import { ProviderList, useFontLoader } from "@/common/util";
import { ThemeProvider } from "@/components/ThemeProvider";

export { ErrorBoundary } from "expo-router";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const loaded = useFontLoader();
  if (!loaded) {
    return null;
  }

  return (
    <ProviderList
      providers={[I18nProvider, IdentityProvider, PaperProvider, ThemeProvider]}
    >
      <Stack />
    </ProviderList>
  );
}

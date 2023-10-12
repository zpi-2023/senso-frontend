import { SplashScreen, Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";

import { AuthProvider } from "@/util/api/auth";
import { I18nProvider } from "@/util/i18n";
import { ProviderList } from "@/util/provider-list";
import { ThemeProvider } from "@/util/theme-provider";
import { useFontLoader } from "@/util/use-font-loader";

export { ErrorBoundary } from "expo-router";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const loaded = useFontLoader();
  if (!loaded) {
    return null;
  }

  return (
    <ProviderList
      providers={[I18nProvider, AuthProvider, PaperProvider, ThemeProvider]}
    >
      <Stack />
    </ProviderList>
  );
}

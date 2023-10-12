import { SplashScreen, Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";

import { AuthProvider } from "@/common/api/auth";
import { I18nProvider } from "@/common/i18n";
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
      providers={[I18nProvider, AuthProvider, PaperProvider, ThemeProvider]}
    >
      <Stack />
    </ProviderList>
  );
}

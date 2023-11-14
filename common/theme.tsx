import {
  ThemeProvider as NavigationThemeProvider,
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from "@react-navigation/native";
import type { PropsWithChildren } from "react";
import { useColorScheme } from "react-native";
import {
  MD3DarkTheme,
  MD3LightTheme,
  PaperProvider,
  useTheme as useThemeNative,
} from "react-native-paper";

import { colors } from "@/common/constants";

const lightTheme = {
  ...NavigationDefaultTheme,
  ...MD3LightTheme,
  colors: {
    ...NavigationDefaultTheme.colors,
    ...MD3LightTheme.colors,
    ...colors.light,
  },
};

const darkTheme = {
  ...NavigationDarkTheme,
  ...MD3DarkTheme,
  colors: {
    ...NavigationDarkTheme.colors,
    ...MD3DarkTheme.colors,
    ...colors.dark,
  },
};

export type SensoTheme = typeof lightTheme & typeof darkTheme;

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? darkTheme : lightTheme;

  return (
    <PaperProvider theme={theme}>
      <NavigationThemeProvider value={theme}>
        {children}
      </NavigationThemeProvider>
    </PaperProvider>
  );
};

export const useTheme = () => useThemeNative<SensoTheme>();

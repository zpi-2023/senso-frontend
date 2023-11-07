import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NativeThemeProvider,
} from "@react-navigation/native";
import type { PropsWithChildren } from "react";
import { useColorScheme } from "react-native";

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const colorScheme = useColorScheme();
  return (
    <NativeThemeProvider
      value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      {children}
    </NativeThemeProvider>
  );
};

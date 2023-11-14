import type { PropsWithChildren } from "react";
import { View } from "react-native";
import { useTheme } from "react-native-paper";

export const MaskingView = ({ children }: PropsWithChildren) => {
  const theme = useTheme();
  return (
    <View
      /* Fixes white flicker during navigation */
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
      }}
    >
      {children}
    </View>
  );
};

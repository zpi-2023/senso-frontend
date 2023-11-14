/* eslint-disable senso-style-wrapper -- used internally */

import { StyleSheet } from "react-native";

import { useTheme, type SensoTheme } from "@/common/theme";

const common = StyleSheet.create({
  full: { flex: 1 },
  center: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  invisible: { opacity: 0 },
});

type ThemedHook = <
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- any is used internally by StyleSheet
  T extends StyleSheet.NamedStyles<T> | StyleSheet.NamedStyles<any>,
>(
  factory: (theme: SensoTheme) => Parameters<typeof StyleSheet.create<T>>[0],
) => () => ReturnType<typeof StyleSheet.create<T>>;

/**
 * Common styling utilities.
 */
export const sty = {
  ...StyleSheet,

  /**
   * Creates a new `StyleSheet`.
   *
   * Use `sty.themedHook` instead if you need to access `SensoTheme`.
   *
   * @example
   * const MyComponent = () => {
   *   return <Text style={styles.highlighted}>Hello!</Text>;
   * }
   *
   * const styles = sty.create({
   *   highlighted: { color: 'red' },
   * });
   */
  create: StyleSheet.create,

  /**
   * Creates a hook, which returns a `StyleSheet` when used.
   *
   * Use `sty.create` instead if you don't need to access `SensoTheme`.
   *
   * @example
   * const MyComponent = () => {
   *   const styles = useStyles();
   *   return <Text style={styles.highlighted}>Hello!</Text>;
   * }
   *
   * const useStyles = sty.themedHook(({ colors }) => ({
   *   highlighted: { color: colors.primary },
   * }));
   */
  themedHook: ((factory) => () => {
    const theme = useTheme();
    return StyleSheet.create(factory(theme));
  }) satisfies ThemedHook as ThemedHook,

  ...common,
};

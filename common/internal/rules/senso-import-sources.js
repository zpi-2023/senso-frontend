const validSources = {
  ActivityIndicator: "react-native-paper",
  AppRoutes: "@/common/constants",
  Button: "react-native-paper",
  CaretakerBanner: "@/components",
  Header: "@/components",
  Icon: "@/components",
  Link: "expo-router",
  Modal: "react-native-paper",
  LoadingScreen: "@/components",
  StyleSheet: "react-native",
  Text: "react-native-paper",
  ThemeProvider: "@/common/theme",
  TouchableWithoutFeedback: "react-native",
  useRouter: "expo-router",
  useTheme: "@/common/theme",
  View: "react-native",
};

/**
 * @typedef {import("eslint").Rule.RuleModule} RuleModule
 */

/**
 * @type {RuleModule}
 */
module.exports = {
  meta: { type: "problem" },
  create(context) {
    return {
      ImportDeclaration({ source, specifiers }) {
        for (const specifier of specifiers) {
          const identifier = specifier.local.name;

          if (
            identifier in validSources &&
            source.value !== validSources[identifier]
          ) {
            context.report({
              node: specifier,
              message:
                "The identifier `{{ identifier }}` must always be imported from `{{ source }}`.",
              data: {
                identifier,
                source: validSources[identifier],
              },
            });
          }
        }
      },
    };
  },
};

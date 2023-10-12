import { Link, Stack } from "expo-router";
import { StyleSheet, View } from "react-native";
import { ActivityIndicator, Button, Text } from "react-native-paper";

import { BASE_URL, useApi, useAuth } from "@/common/api";
import { useI18n } from "@/common/i18n";
import { MonoText } from "@/components/StyledText";

export const Landing = ({ debug = false }: { debug?: boolean }) => {
  const { data, isLoading, error, mutate } = useApi({ url: "/healthz" });
  const { token } = useAuth();
  const { t } = useI18n();

  if (isLoading) {
    return <ActivityIndicator size="large" />;
  }

  if (error || data?.server !== "Ok" || data?.database !== "Ok") {
    return (
      <>
        <Text variant="displayMedium">{t("error")}</Text>

        <Text style={styles.description}>{t("landing.noConnection")}</Text>
        <Button
          mode="contained"
          labelStyle={styles.button}
          onPress={() => mutate()}
        >
          {t("landing.tryAgain")}
        </Button>
        {debug ? (
          <>
            <MonoText style={styles.debug}>
              {new URL("/healthz", BASE_URL).toString()}
              {"\n"}
              {JSON.stringify(data)}
              {"\n"}
              {error?.toString()}
            </MonoText>
            {/* Escape hatch to let us test client without server in development */}
            <Link href="/auth/login" replace>
              <Button textColor="red">IGNORE</Button>
            </Link>
          </>
        ) : null}
      </>
    );
  }

  if (token) {
    // TODO: redirect if logged in
  }

  return (
    <>
      <Text variant="displayMedium">{t("appName")}</Text>

      <Text style={styles.description}>{t("landing.description")}</Text>
      <Link href="/auth/login" replace>
        <Button mode="contained" labelStyle={styles.button}>
          {t("landing.startButton")}
        </Button>
      </Link>
    </>
  );
};

const Page = () => {
  const { t } = useI18n();
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: t("landing.pageTitle") }} />
      <Landing debug={__DEV__} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 32,
  },
  description: {
    textAlign: "center",
    fontSize: 20,
    lineHeight: 28,
    paddingHorizontal: 32,
  },
  button: {
    fontSize: 20,
    lineHeight: 28,
  },
  debug: {
    backgroundColor: "#ffffaa",
    color: "#ff0000",
    textAlign: "center",
    padding: 8,
  },
});

export default Page;

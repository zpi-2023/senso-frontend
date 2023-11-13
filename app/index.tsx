import { Link } from "expo-router";
import { StyleSheet, View } from "react-native";
import { ActivityIndicator, Button, Text } from "react-native-paper";

import { BASE_URL, useQuery } from "@/common/api";
import { AppRoutes } from "@/common/constants";
import { useI18n } from "@/common/i18n";
import { useIdentity, RedirectIfLoggedIn } from "@/common/identity";
import { Header } from "@/components/Header";

const HEALTHZ_PATH = "/api/v1/healthz";

export const Landing = ({ debug = false }: { debug?: boolean }) => {
  const { data, isLoading, error, mutate } = useQuery({
    url: HEALTHZ_PATH,
  });
  const { t } = useI18n();
  const identity = useIdentity();

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
            <Text style={styles.debug}>
              {new URL(HEALTHZ_PATH, BASE_URL).toString()}
              {"\n"}
              {JSON.stringify(data)}
              {"\n"}
              {String(error)}
            </Text>
            {/* Escape hatch to let us test client without server in development */}
            <Link href={AppRoutes.Login} replace>
              {/* eslint-disable-next-line react/jsx-no-literals -- this string is hidden in prod build */}
              <Button textColor="red">IGNORE</Button>
            </Link>
          </>
        ) : null}
      </>
    );
  }

  if (identity.isLoggedIn) {
    return <RedirectIfLoggedIn identity={identity} />;
  }

  return (
    <>
      <Text variant="displayMedium">{t("appName")}</Text>

      <Text style={styles.description}>{t("landing.description")}</Text>
      <Link href={AppRoutes.Login} replace>
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
      <Header title={t("landing.pageTitle")} />
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
    fontFamily: "SpaceMono",
  },
});

export default Page;

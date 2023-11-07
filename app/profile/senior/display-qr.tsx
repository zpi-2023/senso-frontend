import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { ActivityIndicator, Button, Text } from "react-native-paper";
import QRCode from "react-qr-code";

import { actions } from "@/common/actions";
import { useQuery } from "@/common/api";
import { AppRoutes } from "@/common/constants";
import { useI18n } from "@/common/i18n";
import { toMinutesAndSeconds } from "@/common/util/helpers";
import { Header } from "@/components/Header";
import { LoadingScreen } from "@/components/LoadingScreen";

const CreateSeniorProfile = () => {
  const { t } = useI18n();
  const { data, isLoading, mutate } = useQuery({
    url: "/api/v1/account/profiles/senior",
  });
  const [secondsLeft, setSecondsLeft] = useState<number>(data?.validFor || 10);

  useEffect(() => {
    const timer = setInterval(() => {
      if (isLoading) return;
      setSecondsLeft((secondsLeft) => secondsLeft - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isLoading]);

  if (!data) {
    return <LoadingScreen title={t("createSeniorProfile.pageTitle")} />;
  }

  const isCodeValid = secondsLeft > 0;
  const timer = isCodeValid ? toMinutesAndSeconds(secondsLeft) : "--:--";

  const handleReset = () => {
    setSecondsLeft(data?.validFor);
    mutate();
  };

  return (
    <View style={styles.container}>
      <Header
        left={actions.goBack}
        title={t("createSeniorProfile.pageTitle")}
      />
      <Text variant="titleLarge" style={styles.description}>
        {isCodeValid
          ? t("createSeniorProfile.description")
          : t("createSeniorProfile.codeExpired")}
      </Text>
      {!data && (
        <View
          style={{
            width: "70%",
            aspectRatio: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="large" />
        </View>
      )}
      {data && isCodeValid && (
        <View style={styles.codeWrapper}>
          <QRCode
            value={
              JSON.stringify({
                seniorDisplayName: data.seniorDisplayName,
                hash: data.hash,
              }) ?? ""
            }
          />
        </View>
      )}
      {isCodeValid ? (
        <Text variant="titleLarge">
          {`${t("createSeniorProfile.codeValidFor")} ${timer}`}
        </Text>
      ) : (
        <Button
          mode="contained"
          labelStyle={styles.skipButton}
          onPress={handleReset}
        >
          {t("createSeniorProfile.generateCode")}
        </Button>
      )}
      <Link href={AppRoutes.Dashboard} replace>
        <Button labelStyle={styles.skipButton}>
          {t("createSeniorProfile.skipButton")}
        </Button>
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 16,
    marginHorizontal: 24,
    gap: 32,
  },
  codeWrapper: {
    backgroundColor: "white",
    padding: 16,
  },
  description: {
    textAlign: "center",
  },
  skipButton: {
    fontSize: 20,
    lineHeight: 28,
  },
});

export default CreateSeniorProfile;

import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { ActivityIndicator, Button, Text } from "react-native-paper";
import QRCode from "react-qr-code";

import { actions } from "@/common/actions";
import { useQuery } from "@/common/api";
import { AppRoutes } from "@/common/constants";
import { useI18n } from "@/common/i18n";
import { sty } from "@/common/styles";
import { toMinutesAndSeconds } from "@/common/time";
import { Header, LoadingScreen } from "@/components";

const CreateSeniorProfile = () => {
  const { t } = useI18n();
  const { data, isLoading, mutate } = useQuery({
    url: "/api/v1/profiles/senior/pairing",
  });
  const [secondsLeft, setSecondsLeft] = useState<number>(
    data?.validFor || 1200,
  );

  useEffect(() => {
    const timer = setInterval(() => {
      if (isLoading) return;
      setSecondsLeft((secondsLeft) => secondsLeft - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isLoading]);

  if (!data) {
    return <LoadingScreen title={t("profiles.create.senior.pageTitle")} />;
  }

  const isCodeValid = secondsLeft > 0;
  const timer = isCodeValid ? toMinutesAndSeconds(secondsLeft) : "--:--";

  const handleReset = () => {
    setSecondsLeft(data?.validFor);
    void mutate();
  };

  return (
    <View style={styles.container}>
      <Header
        left={actions.goBack}
        title={t("profiles.create.senior.pageTitle")}
      />
      <Text variant="titleLarge" style={styles.description}>
        {isCodeValid
          ? t("profiles.create.senior.description")
          : t("profiles.create.senior.codeExpired")}
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
          {`${t("profiles.create.senior.codeValidFor")} ${timer}`}
        </Text>
      ) : (
        <Button
          mode="contained"
          labelStyle={styles.skipButton}
          onPress={handleReset}
        >
          {t("profiles.create.senior.generateCode")}
        </Button>
      )}
      <Link href={AppRoutes.Dashboard} replace>
        <Button labelStyle={styles.skipButton}>
          {t("profiles.create.senior.skipButton")}
        </Button>
      </Link>
    </View>
  );
};

const styles = sty.create({
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

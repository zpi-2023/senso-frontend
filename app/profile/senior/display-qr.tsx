import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { ActivityIndicator, Button, Text } from "react-native-paper";
import QRCode from "react-qr-code";

import { actions } from "@/common/actions";
import { useApi } from "@/common/api";
import { AppRoutes } from "@/common/constants";
import { useI18n } from "@/common/i18n";
import { toMinutesAndSeconds } from "@/common/util/helpers";
import { Header } from "@/components/Header";

const CreateSeniorProfile = () => {
  const { t } = useI18n();
  const { data, isLoading } = useApi({
    url: "/api/v1/account/profiles/senior",
  });

  const [secondsLeft, setSecondsLeft] = useState(data?.validFor ?? 0);

  const isCodeValid = secondsLeft > 0;
  const timer = isCodeValid ? toMinutesAndSeconds(secondsLeft) : "--:--";

  const handleReset = () => {
    setSecondsLeft(data?.validFor ?? 0);
    // TODO: call for the hash again and update the QR code
  };

  useEffect(() => {
    const timer = setInterval(() => {
      if (isLoading) return;
      setSecondsLeft((secondsLeft) => secondsLeft - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isLoading]);

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
      {isLoading ? (
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
      ) : (
        <QRCode
          value={
            JSON.stringify({
              seniorDisplayName: data?.seniorDisplayName,
              hash: data?.hash,
            }) ?? ""
          }
          display={isCodeValid ? "block" : "none"}
        />
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
          {t("createSeniorProfile.resetCode")}
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
  description: {
    textAlign: "center",
  },
  skipButton: {
    fontSize: 20,
    lineHeight: 28,
  },
});

export default CreateSeniorProfile;

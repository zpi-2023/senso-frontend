import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import QRCode from "react-qr-code";

import { actions } from "@/common/actions";
import { AppRoutes } from "@/common/constants";
import { useI18n } from "@/common/i18n";
import { toMinutesAndSeconds } from "@/common/util/helpers";
import { Header } from "@/components/Header";

const mockApiResponse = {
  validFor: 60,
  seniorDisplayName: "Grzegorz",
  hash: "a703798c7b69ce2569bfdc20ac2e2e3e",
};

const CreateSeniorProfile = () => {
  const { t } = useI18n();
  const [secondsLeft, setSecondsLeft] = useState(mockApiResponse.validFor);
  const isCodeValid = secondsLeft > 0;
  const timer = toMinutesAndSeconds(secondsLeft);

  const handleReset = () => {
    setSecondsLeft(mockApiResponse.validFor);
    // TODO: call API for new hash
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((secondsLeft) => secondsLeft - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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
      <QRCode
        value={
          JSON.stringify({
            seniorDisplayName: mockApiResponse.seniorDisplayName,
            hash: mockApiResponse.hash,
          }) ?? ""
        }
        display={isCodeValid ? "block" : "none"}
      />
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

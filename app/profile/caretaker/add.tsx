import { Link } from "expo-router";
import { StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";

import { actions } from "@/common/actions";
import { useI18n } from "@/common/i18n";
import { AppRoutes } from "@/common/util/constants";
import { Header } from "@/components/Header";

const AddCaretakerProfile = () => {
  const { t } = useI18n();

  return (
    <View style={styles.container}>
      <Header
        left={actions.goBack}
        title={t("createCaretakerProfile.pageTitle")}
      />
      <Text variant="titleLarge" style={styles.description}>
        {t("createCaretakerProfile.description")}
      </Text>
      <Link href={AppRoutes.ScanSeniorQR}>
        <Button labelStyle={styles.skipButton}>Scan QR code</Button>
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

export default AddCaretakerProfile;

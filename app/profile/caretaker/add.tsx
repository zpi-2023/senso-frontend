import { Link } from "expo-router";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";

import { actions } from "@/common/actions";
import { AppRoutes } from "@/common/constants";
import { useI18n } from "@/common/i18n";
import { sty } from "@/common/styles";
import { Header } from "@/components";

const AddCaretakerProfile = () => {
  const { t } = useI18n();

  return (
    <View style={styles.container}>
      <Header
        left={actions.goBack}
        title={t("profiles.create.caretaker.pageTitle")}
      />
      <Text variant="titleLarge" style={styles.description}>
        {t("profiles.create.caretaker.description")}
      </Text>
      <Link href={AppRoutes.ScanSeniorQR}>
        <Button labelStyle={styles.skipButton}>
          {t("profiles.create.caretaker.scanQR")}
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
  description: {
    textAlign: "center",
  },
  skipButton: {
    fontSize: 20,
    lineHeight: 28,
  },
});

export default AddCaretakerProfile;

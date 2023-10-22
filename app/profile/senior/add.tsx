import { Link } from "expo-router";
import { StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";

import { actions } from "@/common/actions";
import { useI18n } from "@/common/i18n";
import { AppRoutes } from "@/common/util/constants";
import { Header } from "@/components/Header";

const ProfilesList = () => {
  const { t } = useI18n();

  return (
    <View style={styles.container}>
      <Header
        left={actions.goBack}
        title={t("createSeniorProfile.pageTitle")}
      />
      <Text variant="titleLarge" style={styles.description}>
        {t("createSeniorProfile.description")}
      </Text>
      <View style={styles.mockQR} />
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
  mockQR: {
    width: "90%",
    aspectRatio: 1,
    backgroundColor: "black",
  },
  skipButton: {
    fontSize: 20,
    lineHeight: 28,
  },
});

export default ProfilesList;

import { StyleSheet, View } from "react-native";

import { useI18n } from "@/common/i18n";
import { Header } from "@/components/Header";
import { Landing } from "@/components/home";

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
});

export default Page;

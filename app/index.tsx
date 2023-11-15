import { View } from "react-native";

import { useI18n } from "@/common/i18n";
import { sty } from "@/common/styles";
import { Header } from "@/components";
import { Landing } from "@/components/home";

const Page = () => {
  const { t } = useI18n();
  return (
    <View style={[sty.center, { gap: 32 }]}>
      <Header title={t("landing.pageTitle")} />
      <Landing debug={__DEV__} />
    </View>
  );
};

export default Page;

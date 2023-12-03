import { View } from "react-native";

import { actions } from "@/common/actions";
import { useI18n } from "@/common/i18n";
import { RedirectIfNoProfile, useIdentity } from "@/common/identity";
import { sty } from "@/common/styles";
import { Header } from "@/components";

const Page = () => {
  const { t } = useI18n();
  const identity = useIdentity();

  if (!identity.hasProfile) {
    return <RedirectIfNoProfile identity={identity} />;
  }

  return (
    <View style={sty.full}>
      <Header left={actions.goBack} title={t("medication.create.pageTitle")} />
    </View>
  );
};

export default Page;

import { Redirect } from "expo-router";
import { FlatList, View } from "react-native";

import { actions } from "@/common/actions";
import { AppRoutes } from "@/common/constants";
import { useI18n } from "@/common/i18n";
import { useIdentity, RedirectIfNoProfile } from "@/common/identity";
import { sty } from "@/common/styles";
import { LoadingScreen, Header, CaretakerBanner } from "@/components";
import { SosFab } from "@/components/alerts";
import { DashboardGadget } from "@/components/dashboard";
import { useDashboardGadgets } from "@/logic/dashboard";

const Page = () => {
  const { t } = useI18n();
  const identity = useIdentity();
  const [gadgets] = useDashboardGadgets();

  if (!identity.hasProfile) {
    return <RedirectIfNoProfile identity={identity} />;
  }

  if (!gadgets) {
    return <LoadingScreen title={t("dashboard.view.pageTitle")} />;
  }

  // Ensure backend's enum changes don't break the app
  if (gadgets.some((action) => !(action in actions))) {
    return <Redirect href={AppRoutes.Menu} />;
  }

  return (
    <View style={sty.full}>
      <Header left={actions.openMenu} title={t("dashboard.view.pageTitle")} />
      <CaretakerBanner />
      <FlatList
        data={gadgets}
        numColumns={2}
        renderItem={({ item }) => <DashboardGadget action={actions[item]} />}
        style={{ padding: 8 }}
      />
      <SosFab />
    </View>
  );
};

export default Page;

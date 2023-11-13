import { FlatList, StyleSheet } from "react-native";

import { actions } from "@/common/actions";
import { useI18n } from "@/common/i18n";
import { useIdentity, RedirectIfNoProfile } from "@/common/identity";
import { LoadingScreen, Header, View, CaretakerBanner } from "@/components";
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
    return <LoadingScreen title={t("dashboard.pageTitle")} />;
  }

  return (
    <View style={styles.container}>
      <Header left={actions.openMenu} title={t("dashboard.pageTitle")} />
      <CaretakerBanner />
      <FlatList
        data={gadgets}
        numColumns={2}
        renderItem={({ item }) => <DashboardGadget action={actions[item]} />}
        style={styles.list}
      />
      <SosFab />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    padding: 8,
  },
});

export default Page;

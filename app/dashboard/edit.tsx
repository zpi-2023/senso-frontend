import { FlatList, StyleSheet } from "react-native";

import { actions } from "@/common/actions";
import { useDashboardGadgets } from "@/common/hooks";
import { useI18n } from "@/common/i18n";
import { RedirectIfNoProfile, useIdentity } from "@/common/identity";
import { Header, View, LoadingScreen, DashboardGadget } from "@/components";

const Page = () => {
  const { t } = useI18n();
  const identity = useIdentity();
  const gadgets = useDashboardGadgets(identity);

  if (!identity.hasProfile) {
    return <RedirectIfNoProfile identity={identity} />;
  }

  if (!gadgets) {
    return <LoadingScreen title={t("editDashboard.pageTitle")} />;
  }

  return (
    <View style={styles.container}>
      <Header left={actions.goBack} title={t("editDashboard.pageTitle")} />
      <FlatList
        data={gadgets}
        numColumns={2}
        renderItem={({ item }) => (
          <DashboardGadget action={actions[item]} inactive />
        )}
        style={styles.list}
      />
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

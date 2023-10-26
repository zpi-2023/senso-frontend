import { FlatList, StyleSheet } from "react-native";
import { ActivityIndicator } from "react-native-paper";

import { actions, ActionKey } from "@/common/actions";
import { useApi } from "@/common/api";
import { useI18n } from "@/common/i18n";
import { useIdentity, RedirectIfNoProfile } from "@/common/identity";
import { DashboardGadget } from "@/components/DashboardGadget";
import { Header } from "@/components/Header";
import { SosFab } from "@/components/SosFab";
import { View } from "@/components/Themed";

const Page = () => {
  const { t } = useI18n();
  const identity = useIdentity();
  const { data } = useApi(
    identity.hasProfile
      ? {
          url: "/api/v1/dashboard/{seniorId}",
          params: { path: { seniorId: identity.profile.seniorId } },
        }
      : null,
  );

  if (!identity.hasProfile) {
    return <RedirectIfNoProfile identity={identity} />;
  }

  if (!data?.gadgets) {
    return (
      <View style={styles.loadingContainer}>
        <Header title={t("dashboard.pageTitle")} />
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const gadgets = data.gadgets as ActionKey[];

  return (
    <View style={styles.container}>
      <Header left={actions.openMenu} title={t("dashboard.pageTitle")} />
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
  loadingContainer: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
  },
});

export default Page;

import { useRouter } from "expo-router";
import { FlatList, StyleSheet } from "react-native";

import { actions, ActionKey } from "@/common/actions";
import { useI18n } from "@/common/i18n";
import { useIdentity, RedirectIfNoProfile } from "@/common/identity";
import { DashboardGadget } from "@/components/DashboardGadget";
import { Header } from "@/components/Header";
import { SosFab } from "@/components/SosFab";
import { View } from "@/components/Themed";

const mockDashboardGadgets: ActionKey[] = [
  "logOut",
  "switchProfile",
  "openMenu",
  "activateSos",
  "logOut",
  "switchProfile",
];

const Page = () => {
  const { t } = useI18n();
  const identity = useIdentity();
  const router = useRouter();

  if (!identity.hasProfile) {
    return <RedirectIfNoProfile identity={identity} />;
  }

  const ctx = { identity, router };

  return (
    <View style={styles.container}>
      <Header left={actions.openMenu} title={t("dashboard.pageTitle")} />
      <FlatList
        data={mockDashboardGadgets}
        numColumns={2}
        renderItem={({ item }) => (
          <DashboardGadget action={actions[item]} ctx={ctx} />
        )}
        style={styles.list}
      />
      <SosFab ctx={ctx} />
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

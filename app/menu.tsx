import { useRouter } from "expo-router";
import { ScrollView } from "react-native";
import { List } from "react-native-paper";

import { actions } from "@/common/actions";
import { useI18n } from "@/common/i18n";
import { useIdentity, RedirectIfNoProfile } from "@/common/identity";
import { Header } from "@/components/Header";
import { MenuItem } from "@/components/MenuItem";
import { View } from "@/components/Themed";

const Page = () => {
  const { t } = useI18n();
  const router = useRouter();
  const identity = useIdentity();

  if (!identity.hasProfile) {
    return <RedirectIfNoProfile identity={identity} />;
  }

  const ctx = { identity, router };

  return (
    <View style={styles.container}>
      <Header left="back" title={t("menu.pageTitle")} />
      <ScrollView>
        <List.Section>
          <List.Subheader>{t("menu.account")}</List.Subheader>
          <MenuItem action={actions.profileList} ctx={ctx} />
          <MenuItem action={actions.logOut} ctx={ctx} />
        </List.Section>
      </ScrollView>
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
  },
};

export default Page;

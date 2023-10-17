import { useRouter } from "expo-router";
import { Text, ScrollView } from "react-native";
import { Banner, List, MD3Theme, useTheme } from "react-native-paper";

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
  const theme = useTheme();

  if (!identity.hasProfile) {
    return <RedirectIfNoProfile identity={identity} />;
  }

  const ctx = { identity, router };

  return (
    <View style={styles.container}>
      <Header left="back" title={t("menu.pageTitle")} />
      {identity.profile.type === "caretaker" ? (
        <Banner visible style={styles.banner(theme)}>
          <Text style={styles.bannerText(theme)}>
            {t("menu.caretakerBanner", { alias: identity.profile.seniorAlias })}
          </Text>
        </Banner>
      ) : null}
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
  banner: (theme: MD3Theme) => ({
    backgroundColor: theme.colors.primary,
    paddingBottom: 8,
  }),
  bannerText: (theme: MD3Theme) => ({
    color: theme.colors.onPrimary,
  }),
};

export default Page;

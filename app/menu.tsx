import { useRouter } from "expo-router";
import { ScrollView, StyleSheet } from "react-native";
import { Banner, List, MD3Theme, useTheme, Text } from "react-native-paper";

import { actions } from "@/common/actions";
import { useI18n } from "@/common/i18n";
import {
  useIdentity,
  RedirectIfNoProfile,
  isCaretaker,
} from "@/common/identity";
import { Header } from "@/components/Header";
import { MenuItem } from "@/components/MenuItem";
import { SosFab } from "@/components/SosFab";
import { View } from "@/components/Themed";

const Page = () => {
  const { t } = useI18n();
  const router = useRouter();
  const identity = useIdentity();
  const theme = useTheme();
  const styles = makeStyles(theme);

  if (!identity.hasProfile) {
    return <RedirectIfNoProfile identity={identity} />;
  }

  const ctx = { identity, router };

  return (
    <View style={styles.container}>
      <Header left={actions.goBack} title={t("menu.pageTitle")} />
      {isCaretaker(identity.profile) ? (
        <Banner visible style={styles.banner}>
          <Text style={styles.bannerText}>
            {t("menu.caretakerBanner", { alias: identity.profile.seniorAlias })}
          </Text>
        </Banner>
      ) : null}
      <ScrollView>
        <List.Section>
          <MenuItem action={actions.openDashboard} ctx={ctx} />
          <MenuItem action={actions.trackMedication} ctx={ctx} />
          <MenuItem action={actions.playGames} ctx={ctx} />
          <MenuItem action={actions.manageNotes} ctx={ctx} />
        </List.Section>
        <List.Section>
          <List.Subheader>{t("menu.account")}</List.Subheader>
          <MenuItem action={actions.pairCaretaker} ctx={ctx} />
          <MenuItem action={actions.switchProfile} ctx={ctx} />
          <MenuItem action={actions.logOut} ctx={ctx} />
        </List.Section>
        <List.Section>
          <List.Subheader>{t("menu.settings")}</List.Subheader>
          <MenuItem action={actions.editDashboard} ctx={ctx} />
          <MenuItem action={actions.changeLanguage} ctx={ctx} />
        </List.Section>
      </ScrollView>
      <SosFab ctx={ctx} />
    </View>
  );
};

const makeStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    banner: {
      backgroundColor: theme.colors.primary,
      paddingBottom: 8,
    },
    bannerText: {
      color: theme.colors.onPrimary,
    },
  });

export default Page;

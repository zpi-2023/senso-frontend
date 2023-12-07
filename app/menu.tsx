import { ScrollView, View } from "react-native";
import { List } from "react-native-paper";

import { actions } from "@/common/actions";
import { useI18n } from "@/common/i18n";
import { useIdentity, RedirectIfNoProfile } from "@/common/identity";
import { sty } from "@/common/styles";
import { CaretakerBanner, Header } from "@/components";
import { SosFab } from "@/components/alerts";
import { MenuItem } from "@/components/menu";

const Page = () => {
  const { t } = useI18n();
  const identity = useIdentity();

  if (!identity.hasProfile) {
    return <RedirectIfNoProfile identity={identity} />;
  }

  return (
    <View style={sty.full}>
      <Header left={actions.goBack} title={t("menu.pageTitle")} />
      <CaretakerBanner />
      <ScrollView>
        <List.Section>
          <MenuItem action={actions.openDashboard} />
          <MenuItem action={actions.trackMedication} />
          <MenuItem action={actions.playGames} />
          <MenuItem action={actions.manageNotes} />
        </List.Section>
        <List.Section>
          <List.Subheader>{t("menu.account")}</List.Subheader>
          <MenuItem action={actions.showSosHistory} />
          <MenuItem action={actions.viewCaretakerList} />
          <MenuItem action={actions.pairCaretaker} />
          <MenuItem action={actions.switchProfile} />
          <MenuItem action={actions.logOut} />
        </List.Section>
        <List.Section>
          <List.Subheader>{t("menu.settings")}</List.Subheader>
          <MenuItem action={actions.editDashboard} />
          <MenuItem action={actions.toggleLanguage} />
        </List.Section>
      </ScrollView>
      <SosFab />
    </View>
  );
};

export default Page;

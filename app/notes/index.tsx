import { useRouter } from "expo-router";
import { ScrollView, View } from "react-native";
import { Button } from "react-native-paper";

import { actions } from "@/common/actions";
import { AppRoutes } from "@/common/constants";
import { useI18n } from "@/common/i18n";
import { RedirectIfNoProfile, isSenior, useIdentity } from "@/common/identity";
import { useRefreshControl } from "@/common/refresh";
import { sty } from "@/common/styles";
import { CaretakerBanner, Header, LoadingScreen } from "@/components";
import { NoteItem } from "@/components/notes";
import { useNoteList } from "@/logic/notes";

const Page = () => {
  const { t } = useI18n();
  const identity = useIdentity();
  const router = useRouter();
  const { notes, refresh } = useNoteList();
  const refreshControl = useRefreshControl(refresh);
  const styles = useStyles();

  if (!identity.hasProfile) {
    return <RedirectIfNoProfile identity={identity} />;
  }

  if (!notes) {
    return <LoadingScreen title={t("noteList.pageTitle")} />;
  }

  return (
    <View style={sty.full}>
      <Header left={actions.goBack} title={t("noteList.pageTitle")} />
      <CaretakerBanner />
      <ScrollView refreshControl={refreshControl}>
        {notes.map((note) => (
          <NoteItem key={note.id} note={note} />
        ))}
      </ScrollView>
      {isSenior(identity.profile) ? (
        <View style={styles.bar}>
          <Button
            mode="contained"
            icon="pencil-plus"
            onPress={() => router.push(AppRoutes.CreateNote)}
          >
            {t("noteList.createNote")}
          </Button>
        </View>
      ) : null}
    </View>
  );
};

const useStyles = sty.themedHook(({ colors }) => ({
  bar: {
    paddingHorizontal: 64,
    paddingVertical: 16,
    backgroundColor: colors.surface,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
}));

export default Page;

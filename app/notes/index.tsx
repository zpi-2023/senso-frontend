import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button } from "react-native-paper";

import { actions } from "@/common/actions";
import { AppRoutes } from "@/common/constants";
import { useI18n } from "@/common/i18n";
import { RedirectIfNoProfile, isSenior, useIdentity } from "@/common/identity";
import { useRefreshControl } from "@/common/refresh";
import { useTheme, type SensoTheme } from "@/common/theme";
import { CaretakerBanner, Header, LoadingScreen } from "@/components";
import { NoteItem } from "@/components/notes";
import { useNoteList } from "@/logic/notes";

const Page = () => {
  const { t } = useI18n();
  const theme = useTheme();
  const identity = useIdentity();
  const router = useRouter();
  const { notes, refresh } = useNoteList();
  const refreshControl = useRefreshControl(refresh);

  if (!identity.hasProfile) {
    return <RedirectIfNoProfile identity={identity} />;
  }

  if (!notes) {
    return <LoadingScreen title={t("noteList.pageTitle")} />;
  }

  const styles = makeStyles(theme);

  return (
    <View style={styles.container}>
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

const makeStyles = (theme: SensoTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    bar: {
      paddingHorizontal: 64,
      paddingVertical: 16,
      backgroundColor: theme.colors.surface,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
    },
  });

export default Page;

import { ScrollView, StyleSheet } from "react-native";
import { Button, type MD3Theme, useTheme } from "react-native-paper";

import { actions } from "@/common/actions";
import { useI18n } from "@/common/i18n";
import { RedirectIfNoProfile, useIdentity } from "@/common/identity";
import { useNoteList } from "@/common/logic";
import { Header, LoadingScreen, View } from "@/components";
import { NoteItem } from "@/components/notes";

const Page = () => {
  const { t } = useI18n();
  const theme = useTheme();
  const identity = useIdentity();
  const notes = useNoteList();

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
      <ScrollView>
        {notes.map((note) => (
          <NoteItem key={note.id} note={note} />
        ))}
      </ScrollView>
      <View style={styles.bar}>
        <Button mode="contained" icon="pencil-plus" onPress={() => undefined}>
          {t("noteList.createNote")}
        </Button>
      </View>
    </View>
  );
};

const makeStyles = (theme: MD3Theme) =>
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

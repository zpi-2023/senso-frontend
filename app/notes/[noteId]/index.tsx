import { Redirect, useRouter } from "expo-router";
import { Alert, ScrollView, StyleSheet } from "react-native";
import {
  useTheme,
  type MD3Theme,
  Button,
  Text,
  IconButton,
} from "react-native-paper";

import { actions } from "@/common/actions";
import { AppRoutes } from "@/common/constants";
import { useI18n } from "@/common/i18n";
import { RedirectIfNoProfile, useIdentity } from "@/common/identity";
import { useNote, notePageTitle, useNoteIdParam } from "@/common/logic";
import { Header, LoadingScreen, View } from "@/components";

const Page = () => {
  const { t } = useI18n();
  const theme = useTheme();
  const identity = useIdentity();
  const router = useRouter();
  const noteId = useNoteIdParam();
  const { note, deleteNote } = useNote(noteId);

  if (!identity.hasProfile) {
    return <RedirectIfNoProfile identity={identity} />;
  }

  if (!noteId) {
    return <Redirect href={AppRoutes.NoteList} />;
  }

  if (!note) {
    return <LoadingScreen title={t("noteDetails.unnamedNote")} />;
  }

  const styles = makeStyles(theme);

  return (
    <View style={styles.container}>
      <Header left={actions.goBack} title={notePageTitle(note)} />
      <ScrollView>
        <Text style={styles.content}>{note.content}</Text>
      </ScrollView>
      <View style={styles.bar}>
        {note.isPrivate ? (
          <IconButton
            style={styles.privateIcon}
            icon="shield-lock"
            iconColor={theme.colors.primary}
            size={24}
          />
        ) : null}
        <Button
          mode="outlined"
          icon="note-edit"
          onPress={() =>
            router.push({
              pathname: AppRoutes.EditNote,
              params: { noteId: note.id },
            })
          }
        >
          {t("noteDetails.edit")}
        </Button>
        <Button
          mode="outlined"
          icon="note-remove"
          onPress={() =>
            Alert.alert(
              t("noteDetails.deleteTitle"),
              t("noteDetails.deleteDescription"),
              [
                { text: t("noteDetails.deleteCancel"), style: "cancel" },
                {
                  text: t("noteDetails.deleteConfirm"),
                  onPress: () => deleteNote().then(router.back),
                },
              ],
            )
          }
        >
          {t("noteDetails.delete")}
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
    content: {
      padding: 24,
      fontSize: 20,
      textAlign: "justify",
    },
    bar: {
      padding: 16,
      backgroundColor: theme.colors.surface,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-evenly",
      alignContent: "center",
    },
    privateIcon: {
      margin: 0,
      padding: 0,
    },
  });

export default Page;

import { Redirect, useRouter } from "expo-router";
import { Alert, ScrollView, View } from "react-native";
import { Button, Text } from "react-native-paper";

import { actions } from "@/common/actions";
import { AppRoutes } from "@/common/constants";
import { useI18n } from "@/common/i18n";
import { RedirectIfNoProfile, isSenior, useIdentity } from "@/common/identity";
import { sty } from "@/common/styles";
import { useTheme } from "@/common/theme";
import { CaretakerBanner, Header, Icon, LoadingScreen } from "@/components";
import { useNote, notePageTitle, useNoteIdParam } from "@/logic/notes";

const Page = () => {
  const { t } = useI18n();
  const theme = useTheme();
  const identity = useIdentity();
  const router = useRouter();
  const noteId = useNoteIdParam();
  const { note, deleteNote } = useNote(noteId);
  const styles = useStyles();

  if (!identity.hasProfile) {
    return <RedirectIfNoProfile identity={identity} />;
  }

  if (!noteId) {
    return <Redirect href={AppRoutes.NoteList} />;
  }

  if (!note) {
    return <LoadingScreen title={t("noteDetails.unnamedNote")} />;
  }

  return (
    <View style={sty.full}>
      <Header left={actions.goBack} title={notePageTitle(note)} />
      <CaretakerBanner />
      <ScrollView>
        <Text style={styles.content}>{note.content}</Text>
      </ScrollView>
      {isSenior(identity.profile) ? (
        <View style={styles.bar}>
          {note.isPrivate ? (
            <Icon
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
      ) : null}
    </View>
  );
};

const useStyles = sty.themedHook(({ colors }) => ({
  content: {
    padding: 24,
    fontSize: 20,
    textAlign: "justify",
  },
  bar: {
    padding: 16,
    backgroundColor: colors.surface,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignContent: "center",
  },
}));

export default Page;

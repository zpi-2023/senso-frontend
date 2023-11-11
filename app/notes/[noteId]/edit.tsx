import { Redirect, router } from "expo-router";
import { StyleSheet } from "react-native";

import { actions } from "@/common/actions";
import { AppRoutes } from "@/common/constants";
import { useI18n } from "@/common/i18n";
import { RedirectIfNoProfile, useIdentity } from "@/common/identity";
import {
  type NoteEdit,
  notePageTitle,
  useNote,
  useNoteIdParam,
} from "@/common/logic";
import { Header, LoadingScreen, View } from "@/components";
import { NoteForm } from "@/components/notes";

const Page = () => {
  const { t } = useI18n();
  const indentity = useIdentity();
  const noteId = useNoteIdParam();
  const { note, editNote } = useNote(noteId);

  if (!indentity.hasProfile) {
    return <RedirectIfNoProfile identity={indentity} />;
  }

  if (!noteId) {
    return <Redirect href={AppRoutes.NoteList} />;
  }

  if (!note) {
    return <LoadingScreen title={t("noteDetails.unnamedNote")} />;
  }

  const handleSubmit = (values: NoteEdit) => editNote(values).then(router.back);

  return (
    <View style={styles.container}>
      <Header left={actions.goBack} title={notePageTitle(note)} />
      <NoteForm
        initialValues={note}
        onSubmit={handleSubmit}
        submitText={t("editNote.submit")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Page;

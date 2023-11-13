import { Redirect, router } from "expo-router";
import { StyleSheet } from "react-native";

import { actions } from "@/common/actions";
import { AppRoutes } from "@/common/constants";
import { useI18n } from "@/common/i18n";
import {
  RedirectIfNoProfile,
  isCaretaker,
  useIdentity,
} from "@/common/identity";
import { Header, LoadingScreen, View } from "@/components";
import { NoteForm } from "@/components/notes";
import {
  type NoteEdit,
  notePageTitle,
  useNote,
  useNoteIdParam,
} from "@/logic/notes";

const Page = () => {
  const { t } = useI18n();
  const identity = useIdentity();
  const noteId = useNoteIdParam();
  const { note, editNote } = useNote(noteId);

  if (!identity.hasProfile) {
    return <RedirectIfNoProfile identity={identity} />;
  }

  if (!noteId || isCaretaker(identity.profile)) {
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

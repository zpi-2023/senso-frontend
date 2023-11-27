import { Redirect, router } from "expo-router";
import { View } from "react-native";

import { actions } from "@/common/actions";
import { AppRoutes } from "@/common/constants";
import { useI18n } from "@/common/i18n";
import {
  RedirectIfNoProfile,
  isCaretaker,
  useIdentity,
} from "@/common/identity";
import { sty } from "@/common/styles";
import { Header, LoadingScreen } from "@/components";
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
    return <LoadingScreen title={t("notes.details.unnamedNote")} />;
  }

  const handleSubmit = (values: NoteEdit) => editNote(values).then(router.back);

  return (
    <View style={sty.full}>
      <Header left={actions.goBack} title={notePageTitle(note)} />
      <NoteForm
        initialValues={note}
        onSubmit={handleSubmit}
        submitText={t("notes.edit.submit")}
      />
    </View>
  );
};

export default Page;

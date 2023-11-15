import { Redirect, useRouter } from "expo-router";
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
import { Header } from "@/components";
import { NoteForm } from "@/components/notes";
import { type NoteEdit, useCreateNote } from "@/logic/notes";

const Page = () => {
  const { t } = useI18n();
  const identity = useIdentity();
  const router = useRouter();
  const createNote = useCreateNote();

  if (!identity.hasProfile) {
    return <RedirectIfNoProfile identity={identity} />;
  }

  if (isCaretaker(identity.profile)) {
    return <Redirect href={AppRoutes.NoteList} />;
  }

  const handleSubmit = (values: NoteEdit) =>
    createNote(values).then((note) => {
      if (note) {
        router.replace({
          pathname: AppRoutes.NoteDetails,
          params: { noteId: note.id },
        });
      }
    });

  return (
    <View style={sty.full}>
      <Header left={actions.goBack} title={t("createNote.pageTitle")} />
      <NoteForm
        initialValues={{ content: "", isPrivate: false }}
        onSubmit={handleSubmit}
        submitText={t("createNote.submit")}
      />
    </View>
  );
};

export default Page;

import { useRouter } from "expo-router";
import { StyleSheet } from "react-native";

import { actions } from "@/common/actions";
import { AppRoutes } from "@/common/constants";
import { useI18n } from "@/common/i18n";
import { RedirectIfNoProfile, useIdentity } from "@/common/identity";
import { type NoteEdit, useCreateNote } from "@/common/logic";
import { Header, View } from "@/components";
import { NoteForm } from "@/components/notes";

const Page = () => {
  const { t } = useI18n();
  const indentity = useIdentity();
  const router = useRouter();
  const createNote = useCreateNote();

  if (!indentity.hasProfile) {
    return <RedirectIfNoProfile identity={indentity} />;
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
    <View style={styles.container}>
      <Header left={actions.goBack} title={t("createNote.pageTitle")} />
      <NoteForm
        initialValues={{ content: "", isPrivate: false }}
        onSubmit={handleSubmit}
        submitText={t("createNote.submit")}
      />
    </View>
  );
};

const styles = StyleSheet.create({ container: { flex: 1 } });

export default Page;

import { StyleSheet } from "react-native";

import { actions } from "@/common/actions";
import { useI18n } from "@/common/i18n";
import { RedirectIfNoProfile, useIdentity } from "@/common/identity";
import { Header, View } from "@/components";
import { NoteForm } from "@/components/notes";

const Page = () => {
  const { t } = useI18n();
  const indentity = useIdentity();

  if (!indentity.hasProfile) {
    return <RedirectIfNoProfile identity={indentity} />;
  }

  return (
    <View style={styles.container}>
      <Header left={actions.goBack} title={t("createNote.pageTitle")} />
      <NoteForm
        initialValues={{ content: "", isPrivate: false }}
        onSubmit={() => undefined}
        submitText={t("createNote.submit")}
      />
    </View>
  );
};

const styles = StyleSheet.create({ container: { flex: 1 } });

export default Page;

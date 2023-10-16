import { useI18n } from "@/common/i18n";
import { useIdentity, RedirectIfNoProfile } from "@/common/identity";
import { Header } from "@/components/Header";
import { View } from "@/components/Themed";

const Page = () => {
  const { t } = useI18n();
  const identity = useIdentity();

  if (!identity.hasProfile) {
    return <RedirectIfNoProfile identity={identity} />;
  }

  return (
    <View>
      <Header left="back" title={t("menu.pageTitle")} />
    </View>
  );
};

export default Page;

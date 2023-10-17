import { useRouter } from "expo-router";

import { useI18n } from "@/common/i18n";
import { useIdentity, RedirectIfNoProfile } from "@/common/identity";
import { Header } from "@/components/Header";
import { MonoText } from "@/components/StyledText";
import { View } from "@/components/Themed";

const Page = () => {
  const { t } = useI18n();
  const identity = useIdentity();
  const router = useRouter();

  if (!identity.hasProfile) {
    return <RedirectIfNoProfile identity={identity} />;
  }

  return (
    <View>
      <Header
        left={{ icon: "menu", onPress: () => router.push("/menu") }}
        title={t("dashboard.pageTitle")}
      />
      {/* TODO: This shouldn't be here */}
      <MonoText>{JSON.stringify(identity.profile, null, 2)}</MonoText>
    </View>
  );
};

export default Page;

import { View } from "react-native";

import { actions } from "@/common/actions";
import { useI18n } from "@/common/i18n";
import { RedirectIfNoProfile, useIdentity } from "@/common/identity";
import { CaretakerBanner, Header, PaginatedScrollView } from "@/components";
import { IntakeEntry } from "@/components/medication";
import { Intake } from "@/logic/medication";

const Page = () => {
  const { t } = useI18n();
  const identity = useIdentity();

  if (!identity.hasProfile) {
    return <RedirectIfNoProfile identity={identity} />;
  }

  const { seniorId } = identity.profile;

  return (
    <View>
      <Header left={actions.goBack} title={t("medication.intakes.pageTitle")} />
      <CaretakerBanner />
      <PaginatedScrollView
        renderer={(data) => <IntakeEntry intake={Intake.fromData(data)} />}
        query={{
          url: "/api/v1/reminders/senior/{seniorId}/intakes",
          params: { path: { seniorId } },
        }}
        itemsPerPage={5}
        invalidationUrl="/api/v1/reminders"
      />
    </View>
  );
};

export default Page;

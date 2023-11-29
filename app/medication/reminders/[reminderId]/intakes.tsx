import { Redirect } from "expo-router";
import { View } from "react-native";

import { actions } from "@/common/actions";
import { AppRoutes } from "@/common/constants";
import { useI18n } from "@/common/i18n";
import { RedirectIfNoProfile, useIdentity } from "@/common/identity";
import { CaretakerBanner, Header, PaginatedScrollView } from "@/components";
import { IntakeEntry } from "@/components/medication";
import { useReminderParams } from "@/logic/medication";

const Page = () => {
  const identity = useIdentity();
  const { t } = useI18n();
  const { reminderId } = useReminderParams();

  if (!identity.hasProfile) {
    return <RedirectIfNoProfile identity={identity} />;
  }

  if (!reminderId) {
    return <Redirect href={AppRoutes.IntakeHistory} />;
  }

  return (
    <View>
      <Header left={actions.goBack} title={t("medication.intakes.pageTitle")} />
      <CaretakerBanner />
      <PaginatedScrollView
        renderer={(intake) => (
          <IntakeEntry
            intake={{ ...intake, takenAt: new Date(intake.takenAt) }}
          />
        )}
        query={{
          url: "/api/v1/reminders/{reminderId}/intakes",
          params: { path: { reminderId } },
        }}
        itemsPerPage={5}
        invalidationUrl="/api/v1/reminders"
      />
    </View>
  );
};

export default Page;

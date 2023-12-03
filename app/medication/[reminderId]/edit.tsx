import { Redirect } from "expo-router";
import { View } from "react-native";

import { actions } from "@/common/actions";
import { useQuery } from "@/common/api";
import { AppRoutes } from "@/common/constants";
import { useI18n } from "@/common/i18n";
import { RedirectIfNoProfile, useIdentity } from "@/common/identity";
import { sty } from "@/common/styles";
import { Header, LoadingScreen } from "@/components";
import { Reminder, useReminderParams } from "@/logic/medication";

const Page = () => {
  const { t } = useI18n();
  const identity = useIdentity();

  const { reminderId } = useReminderParams();
  const { data } = useQuery(
    reminderId
      ? {
          url: "/api/v1/reminders/{reminderId}",
          params: { path: { reminderId } },
        }
      : null,
  );

  if (!identity.hasProfile) {
    return <RedirectIfNoProfile identity={identity} />;
  }

  if (!reminderId) {
    return <Redirect href={AppRoutes.MedicationList} />;
  }

  if (!data) {
    return <LoadingScreen title={t("medication.details.unnamedReminder")} />;
  }

  const reminder = Reminder.fromData(data);

  return (
    <View style={sty.full}>
      <Header left={actions.goBack} title={reminder.title(t)} />
    </View>
  );
};

export default Page;

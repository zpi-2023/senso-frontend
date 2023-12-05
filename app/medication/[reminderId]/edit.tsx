import { Redirect, useRouter } from "expo-router";
import { View } from "react-native";

import { actions } from "@/common/actions";
import { useMutation, useQuery, useQueryInvalidation } from "@/common/api";
import { AppRoutes } from "@/common/constants";
import { useI18n } from "@/common/i18n";
import { RedirectIfNoProfile, useIdentity } from "@/common/identity";
import { sty } from "@/common/styles";
import { CaretakerBanner, Header, LoadingScreen } from "@/components";
import { ReminderForm } from "@/components/medication";
import { Reminder, useReminderParams } from "@/logic/medication";

const Page = () => {
  const { t } = useI18n();
  const identity = useIdentity();
  const router = useRouter();

  const { reminderId } = useReminderParams();
  const { data } = useQuery(
    reminderId
      ? {
          url: "/api/v1/reminders/{reminderId}",
          params: { path: { reminderId } },
        }
      : null,
  );

  const editReminder = useMutation("put", "/api/v1/reminders/{reminderId}");
  const invalidateReminders = useQueryInvalidation("/api/v1/reminders");

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
      <CaretakerBanner />
      <ReminderForm
        kind="edit"
        initialValues={{
          medicationName: data.medicationName,
          medicationAmountInPackage:
            data.medicationAmountInPackage?.toString() ?? "",
          amountPerIntake: data.amountPerIntake.toString(),
          amountOwned: data.amountOwned?.toString() ?? "",
          amountUnit: data.amountUnit ?? "",
          cron: data.cron ?? "",
          description: data.description ?? "",
        }}
        submitText={t("medication.edit.submit")}
        onEditSubmit={async (values) => {
          const { data } = await editReminder({
            params: { path: { reminderId } },
            body: values,
          });
          if (data) {
            await invalidateReminders();
            router.back();
          }
        }}
      />
    </View>
  );
};

export default Page;

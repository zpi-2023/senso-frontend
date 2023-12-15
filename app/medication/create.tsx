import { useRouter } from "expo-router";
import { View } from "react-native";

import { actions } from "@/common/actions";
import { useMutation, useQueryInvalidation } from "@/common/api";
import { AppRoutes } from "@/common/constants";
import { useI18n } from "@/common/i18n";
import { RedirectIfNoProfile, useIdentity } from "@/common/identity";
import { sty } from "@/common/styles";
import { CaretakerBanner, Header } from "@/components";
import { ReminderForm } from "@/components/medication";

const Page = () => {
  const { t } = useI18n();
  const identity = useIdentity();
  const router = useRouter();

  const createReminder = useMutation(
    "post",
    "/api/v1/reminders/senior/{seniorId}",
  );
  const invalidateReminders = useQueryInvalidation("/api/v1/reminders");

  if (!identity.hasProfile) {
    return <RedirectIfNoProfile identity={identity} />;
  }

  return (
    <View style={sty.full}>
      <Header left={actions.goBack} title={t("medication.create.pageTitle")} />
      <CaretakerBanner />
      <ReminderForm
        kind="create"
        initialValues={{
          medicationName: "",
          medicationAmountInPackage: "",
          amountPerIntake: "",
          amountOwned: "",
          amountUnit: "",
          localCron: "",
          description: "",
        }}
        submitText={t("medication.create.submit")}
        onCreateSubmit={async (values) => {
          const { data } = await createReminder({
            params: { path: { seniorId: identity.profile.seniorId } },
            body: values,
          });
          if (data) {
            await invalidateReminders();
            router.replace({
              pathname: AppRoutes.ReminderDetails,
              params: { reminderId: data.id, tab: "details" },
            });
          }
        }}
      />
    </View>
  );
};

export default Page;

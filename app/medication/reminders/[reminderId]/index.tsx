import { Redirect } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { Button, SegmentedButtons } from "react-native-paper";

import { actions } from "@/common/actions";
import { useQuery } from "@/common/api";
import { AppRoutes } from "@/common/constants";
import { useI18n } from "@/common/i18n";
import { RedirectIfNoProfile, isSenior, useIdentity } from "@/common/identity";
import { sty } from "@/common/styles";
import { CaretakerBanner, Header, LoadingScreen } from "@/components";
import {
  ReminderDetails,
  ReminderHistory,
  useReminderDeactivateDialog,
} from "@/components/medication";
import { Reminder, useReminderParams } from "@/logic/medication";

const Page = () => {
  const { t } = useI18n();
  const styles = useStyles();
  const identity = useIdentity();

  const { reminderId, tab: defaultTab } = useReminderParams();
  const { data } = useQuery(
    reminderId
      ? {
          url: "/api/v1/reminders/{reminderId}",
          params: { path: { reminderId } },
        }
      : null,
  );

  const { dialog: deactivateDialog, showDialog: showDeactivateDialog } =
    useReminderDeactivateDialog(data?.id ?? null);

  const [tab, setTab] = useState<"details" | "history">(defaultTab);

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
      <Header
        left={actions.goBack}
        title={`${reminder.medicationName} - ${reminder.formatAmountPerIntake(
          t,
        )}`}
      />
      <CaretakerBanner />
      <SegmentedButtons
        style={styles.selector}
        value={tab}
        onValueChange={(value) => setTab(value as "details" | "history")}
        buttons={[
          {
            value: "details",
            icon: "information-outline",
            label: t("medication.details.tabs.details"),
          },
          {
            value: "history",
            icon: "history",
            label: t("medication.details.tabs.history"),
          },
        ]}
      />
      <View style={sty.full}>
        {tab === "details" ? (
          <ReminderDetails
            reminder={reminder}
            canTake={reminder.isActive && isSenior(identity.profile)}
          />
        ) : (
          <ReminderHistory reminderId={reminder.id} />
        )}
      </View>
      {reminder.isActive ? (
        <View style={styles.bar}>
          <Button mode="outlined" icon="pencil" onPress={() => {}}>
            {t("medication.details.editReminder")}
          </Button>
          <Button
            mode="outlined"
            icon="bell-off-outline"
            onPress={showDeactivateDialog}
          >
            {t("medication.details.deactivateReminder")}
          </Button>
        </View>
      ) : null}
      {deactivateDialog}
    </View>
  );
};

const useStyles = sty.themedHook(({ colors }) => ({
  selector: {
    margin: 16,
  },
  bar: {
    padding: 16,
    backgroundColor: colors.surface,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignContent: "center",
  },
}));

export default Page;

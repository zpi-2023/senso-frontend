import { useState } from "react";
import { View } from "react-native";
import { Button, SegmentedButtons } from "react-native-paper";

import { actions } from "@/common/actions";
import { useQuery } from "@/common/api";
import { useI18n } from "@/common/i18n";
import { RedirectIfNoProfile, isSenior, useIdentity } from "@/common/identity";
import { sty } from "@/common/styles";
import { CaretakerBanner, Header, LoadingScreen } from "@/components";
import {
  ReminderDetails,
  ReminderHistory,
  useReminderDeactivateDialog,
} from "@/components/medication";
import { useReminderIdParam } from "@/logic/medication";

const Page = () => {
  const { t } = useI18n();
  const styles = useStyles();
  const identity = useIdentity();

  const reminderId = useReminderIdParam();
  const { data: reminder } = useQuery(
    reminderId
      ? {
          url: "/api/v1/reminders/{reminderId}",
          params: { path: { reminderId } },
        }
      : null,
  );

  const { dialog: deactivateDialog, showDialog: showDeactivateDialog } =
    useReminderDeactivateDialog(reminder?.id ?? null);

  const [tab, setTab] = useState<"details" | "history">("details");

  if (!identity.hasProfile) {
    return <RedirectIfNoProfile identity={identity} />;
  }

  if (!reminder) {
    return <LoadingScreen title={t("medicationDetails.unnamedReminder")} />;
  }

  return (
    <View style={sty.full}>
      <Header
        left={actions.goBack}
        title={`${reminder.medicationName} - ${reminder.amountPerIntake} ${
          reminder.amountUnit ?? t("medication.pills")
        }`}
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
            label: t("medicationDetails.detailsTab"),
          },
          {
            value: "history",
            icon: "history",
            label: t("medicationDetails.historyTab"),
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
            {t("medicationDetails.editReminder")}
          </Button>
          <Button
            mode="outlined"
            icon="bell-off-outline"
            onPress={showDeactivateDialog}
          >
            {t("medicationDetails.deactivateReminder")}
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

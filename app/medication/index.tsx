import { router } from "expo-router";
import { View } from "react-native";
import { Button } from "react-native-paper";

import { actions } from "@/common/actions";
import { AppRoutes } from "@/common/constants";
import { useI18n } from "@/common/i18n";
import { RedirectIfNoProfile, useIdentity } from "@/common/identity";
import { sty } from "@/common/styles";
import { CaretakerBanner, Header, PaginatedScrollView } from "@/components";
import { ReminderCard } from "@/components/medication";
import { Reminder } from "@/logic/medication";

const Page = () => {
  const { t } = useI18n();
  const identity = useIdentity();
  const styles = useStyles();

  if (!identity.hasProfile) {
    return <RedirectIfNoProfile identity={identity} />;
  }

  const { seniorId } = identity.profile;

  return (
    <View style={sty.full}>
      <Header
        left={actions.goBack}
        title={t("medication.list.pageTitle")}
        right={actions.intakeHistory}
      />
      <CaretakerBanner />
      <PaginatedScrollView
        style={styles.view}
        renderer={(data) => (
          <ReminderCard
            reminder={Reminder.fromData(data)}
            style={styles.card}
          />
        )}
        query={{
          url: "/api/v1/reminders/senior/{seniorId}",
          params: { path: { seniorId } },
        }}
        itemsPerPage={5}
        invalidationUrl="/api/v1/reminders/senior/{seniorId}"
      />
      <View style={styles.bar}>
        <Button
          mode="contained"
          icon="pencil-plus"
          onPress={() => router.push(AppRoutes.CreateReminder)}
        >
          {t("medication.list.createReminder")}
        </Button>
      </View>
    </View>
  );
};

const useStyles = sty.themedHook(({ colors }) => ({
  view: {
    padding: 8,
  },
  card: {
    marginVertical: 8,
  },
  bar: {
    paddingHorizontal: 64,
    paddingVertical: 16,
    backgroundColor: colors.surface,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
}));

export default Page;

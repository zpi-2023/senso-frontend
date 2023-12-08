import { View } from "react-native";
import { List } from "react-native-paper";

import { type IconSource, actions } from "@/common/actions";
import { type Translator, useI18n } from "@/common/i18n";
import { RedirectIfNoProfile, useIdentity } from "@/common/identity";
import { sty } from "@/common/styles";
import { formatShortOffset } from "@/common/time";
import { CaretakerBanner, Header, PaginatedScrollView } from "@/components";

const types = {
  sos: {
    title: (t: Translator) => t("alerts.types.sos"),
    icon: "alarm-light",
    important: true,
  },
  medicationToTake: {
    title: (t: Translator) => t("alerts.types.medicationToTake"),
    icon: "pill",
    important: false,
  },
  medicationNotTaken: {
    title: (t: Translator) => t("alerts.types.medicationNotTaken"),
    icon: "clock-alert-outline",
    important: true,
  },
} satisfies Record<
  string,
  { title: (t: Translator) => string; icon: IconSource; important: boolean }
>;

const Page = () => {
  const { t } = useI18n();
  const identity = useIdentity();
  const styles = useStyles();

  if (!identity.hasProfile) {
    return <RedirectIfNoProfile identity={identity} />;
  }

  const { seniorId } = identity.profile;

  return (
    <View>
      <Header left={actions.goBack} title={t("alerts.history.pageTitle")} />
      <CaretakerBanner />
      <PaginatedScrollView
        renderer={(data) => {
          const type = types[data.type as keyof typeof types];
          const style = type.important ? styles.important : styles.normal;
          return (
            <List.Item
              title={type.title(t)}
              description={formatShortOffset(new Date(data.firedAt), t)}
              left={(props) => (
                <List.Icon {...props} icon={type.icon} color={style.color} />
              )}
              titleStyle={style}
              descriptionStyle={style}
            />
          );
        }}
        query={{
          url: "/api/v1/alerts/history/{seniorId}",
          params: { path: { seniorId } },
        }}
        itemsPerPage={5}
        invalidationUrl="/api/v1/alerts"
      />
    </View>
  );
};

const useStyles = sty.themedHook(({ colors }) => ({
  important: {
    color: colors.alert,
  },
  normal: {
    color: colors.text,
  },
}));

export default Page;

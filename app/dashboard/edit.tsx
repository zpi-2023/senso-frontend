import { ScrollView } from "react-native";
import { Divider, List } from "react-native-paper";

import { actions } from "@/common/actions";
import { MAX_GADGETS, availableGadgets } from "@/common/constants";
import { useI18n } from "@/common/i18n";
import { RedirectIfNoProfile, useIdentity } from "@/common/identity";
import { useDashboardGadgets } from "@/common/logic";
import { Header, View, LoadingScreen } from "@/components";
import {
  DashboardEditSelected,
  DashboardEditAvailable,
} from "@/components/dashboard";

const Page = () => {
  const { t } = useI18n();
  const identity = useIdentity();
  const [gadgets, setGadgets] = useDashboardGadgets();

  if (!identity.hasProfile) {
    return <RedirectIfNoProfile identity={identity} />;
  }

  if (!gadgets) {
    return <LoadingScreen title={t("editDashboard.pageTitle")} />;
  }

  return (
    <View>
      <Header left={actions.goBack} title={t("editDashboard.pageTitle")} />
      <ScrollView>
        <List.Section>
          <List.Subheader>
            {t("editDashboard.selectedGadgets", {
              current: gadgets.length,
              max: MAX_GADGETS,
            })}
          </List.Subheader>
          {gadgets.map((gadget, index) => (
            <DashboardEditSelected
              key={gadget}
              gadget={gadget}
              isFirst={index === 0}
              isLast={index === gadgets.length - 1}
              onRemove={() => setGadgets(gadgets.filter((g) => g !== gadget))}
              onMoveUp={() =>
                setGadgets([
                  ...gadgets.slice(0, index - 1),
                  gadgets[index]!,
                  gadgets[index - 1]!,
                  ...gadgets.slice(index + 1),
                ])
              }
              onMoveDown={() =>
                setGadgets([
                  ...gadgets.slice(0, index),
                  gadgets[index + 1]!,
                  gadgets[index]!,
                  ...gadgets.slice(index + 2),
                ])
              }
            />
          ))}
        </List.Section>
        <Divider />
        <List.Section>
          <List.Subheader>{t("editDashboard.availableGadgets")}</List.Subheader>
          {availableGadgets
            .filter((gadget) => !gadgets.includes(gadget))
            .map((gadget) => (
              <DashboardEditAvailable
                key={gadget}
                gadget={gadget}
                disabled={gadgets.length >= MAX_GADGETS}
                onAdd={() => setGadgets([...gadgets, gadget])}
              />
            ))}
        </List.Section>
      </ScrollView>
    </View>
  );
};

export default Page;

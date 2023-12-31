import { ScrollView, View } from "react-native";
import { Divider, List } from "react-native-paper";

import { actions } from "@/common/actions";
import { maxGadgets, availableGadgets } from "@/common/constants";
import { useI18n } from "@/common/i18n";
import { RedirectIfNoProfile, useIdentity } from "@/common/identity";
import { Header, LoadingScreen, CaretakerBanner } from "@/components";
import {
  DashboardEditSelected,
  DashboardEditAvailable,
} from "@/components/dashboard";
import { useDashboardGadgets } from "@/logic/dashboard";

const Page = () => {
  const { t } = useI18n();
  const identity = useIdentity();
  const [gadgets, setGadgets] = useDashboardGadgets();

  if (!identity.hasProfile) {
    return <RedirectIfNoProfile identity={identity} />;
  }

  if (!gadgets) {
    return <LoadingScreen title={t("dashboard.edit.pageTitle")} />;
  }

  return (
    <View>
      <Header left={actions.goBack} title={t("dashboard.edit.pageTitle")} />
      <CaretakerBanner />
      <ScrollView>
        <List.Section>
          <List.Subheader>
            {t("dashboard.edit.selectedGadgets", {
              current: gadgets.length,
              max: maxGadgets,
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
          <List.Subheader>
            {t("dashboard.edit.availableGadgets")}
          </List.Subheader>
          {availableGadgets
            .filter((gadget) => !gadgets.includes(gadget))
            .map((gadget) => (
              <DashboardEditAvailable
                key={gadget}
                gadget={gadget}
                disabled={gadgets.length >= maxGadgets}
                onAdd={() => setGadgets([...gadgets, gadget])}
              />
            ))}
        </List.Section>
      </ScrollView>
    </View>
  );
};

export default Page;

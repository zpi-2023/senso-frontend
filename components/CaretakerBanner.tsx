import { Banner, Text } from "react-native-paper";

import { useI18n } from "@/common/i18n";
import { isCaretaker, useIdentity } from "@/common/identity";
import { sty } from "@/common/styles";

export const CaretakerBanner = () => {
  const { t } = useI18n();
  const identity = useIdentity();
  const styles = useStyles();

  return identity.hasProfile && isCaretaker(identity.profile) ? (
    <Banner visible style={styles.banner}>
      <Text style={styles.bannerText}>
        {t("menu.caretakerBanner", { alias: identity.profile.seniorAlias })}
      </Text>
    </Banner>
  ) : null;
};

const useStyles = sty.themedHook(({ colors }) => ({
  banner: {
    backgroundColor: colors.primary,
    paddingBottom: 8,
  },
  bannerText: {
    color: colors.onPrimary,
  },
}));

import { StyleSheet } from "react-native";
import { Banner, type MD3Theme, Text, useTheme } from "react-native-paper";

import { useI18n } from "@/common/i18n";
import { isCaretaker, useIdentity } from "@/common/identity";

export const CaretakerBanner = () => {
  const { t } = useI18n();
  const theme = useTheme();
  const identity = useIdentity();

  const styles = makeStyles(theme);

  return identity.hasProfile && isCaretaker(identity.profile) ? (
    <Banner visible style={styles.banner}>
      <Text style={styles.bannerText}>
        {t("menu.caretakerBanner", { alias: identity.profile.seniorAlias })}
      </Text>
    </Banner>
  ) : null;
};

const makeStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    banner: {
      backgroundColor: theme.colors.primary,
      paddingBottom: 8,
    },
    bannerText: {
      color: theme.colors.onPrimary,
    },
  });

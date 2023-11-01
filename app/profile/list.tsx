import { Link } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Avatar, Button, List, MD3Theme, useTheme } from "react-native-paper";

import { actions } from "@/common/actions";
import { POST, useQuery } from "@/common/api";
import { AppRoutes } from "@/common/constants";
import { useI18n } from "@/common/i18n";
import {
  Profile,
  isSenior,
  isCaretaker,
  useIdentity,
  RedirectIfLoggedOut,
  SeniorProfile,
} from "@/common/identity";
import { Header } from "@/components/Header";
import { LoadingScreen } from "@/components/LoadingScreen";

const ProfilesList = () => {
  const { t } = useI18n();
  const theme = useTheme();
  const styles = makeStyles(theme);
  const identity = useIdentity();
  const { data } = useQuery({
    url: "/api/v1/account/profiles",
  });
  const [isCreatingSeniorProfile, setIsCreatingSeniorProfile] = useState(false);

  if (!identity.isLoggedIn) {
    return <RedirectIfLoggedOut identity={identity} />;
  }

  if (!data) {
    return <LoadingScreen title={t("profileList.pageTitle")} />;
  }

  // TODO: add proper API response handling when API is ready
  const { profiles } = data as { profiles: Profile[] };

  const seniorProfile = profiles.find(isSenior);
  const caretakerProfiles = profiles.filter(isCaretaker);

  const handleItemPress = (profile: Profile) => identity.selectProfile(profile);

  const handleCreateSeniorProfile = async () => {
    setIsCreatingSeniorProfile(true);
    const { data: seniorProfile } = await POST(
      "/api/v1/account/profiles/senior",
      { headers: { Authorization: `Bearer ${identity.token}` } },
    );

    if (!seniorProfile) {
      return; // TODO: handle error
    }

    identity.selectProfile(
      seniorProfile as SeniorProfile,
      AppRoutes.DisplaySeniorQR,
    );
    setIsCreatingSeniorProfile(false);
  };

  return (
    <View style={styles.container}>
      <Header left={actions.goBack} title={t("profileList.pageTitle")} />
      <List.Section>
        {caretakerProfiles.length > 0 && (
          <List.Subheader style={styles.listSubheader}>
            {t("profileList.caretakersHeader")}
          </List.Subheader>
        )}
        <ScrollView style={styles.scrollView}>
          {caretakerProfiles.map((p) => {
            return (
              <List.Item
                key={p.seniorId}
                title={t("profileList.caretakerNameFallback")}
                description={`Senior: ${p.seniorAlias}`}
                onPress={() => handleItemPress(p)}
                style={styles.listItem}
                titleStyle={styles.listItemTitle}
                descriptionStyle={styles.listItemDescription}
                left={(props) => (
                  <Avatar.Image
                    {...props}
                    size={64}
                    source={require("../../assets/images/caretaker16.png")}
                  />
                )}
              />
            );
          })}
        </ScrollView>
        {seniorProfile && (
          <>
            <List.Subheader style={styles.listSubheader}>
              {t("profileList.seniorHeader")}
            </List.Subheader>
            <List.Item
              title={t("profileList.seniorNameFallback")}
              description={t("profileList.seniorDescription")}
              onPress={() => handleItemPress(seniorProfile)}
              style={styles.listItem}
              titleStyle={styles.listItemTitle}
              descriptionStyle={styles.listItemDescription}
              left={(props) => (
                <Avatar.Image
                  {...props}
                  size={64}
                  source={require("../../assets/images/oldman16.png")}
                />
              )}
            />
          </>
        )}
      </List.Section>
      {profiles.length === 0 && (
        <List.Subheader style={styles.listSubheader}>
          {t("profileList.noProfiles")}
        </List.Subheader>
      )}
      <View style={styles.newProfileButtonWrapper}>
        <Link href={AppRoutes.AddCaretakerProfile}>
          <Button icon="account-eye-outline" mode="outlined" uppercase>
            {t("profileList.newCaretakerProfileButton")}
          </Button>
        </Link>
        {!seniorProfile && (
          <Link href={AppRoutes.DisplaySeniorQR} replace>
            <Button
              icon="plus"
              mode="contained"
              uppercase
              disabled={isCreatingSeniorProfile}
              loading={isCreatingSeniorProfile}
              onPress={handleCreateSeniorProfile}
            >
              {t("profileList.newSeniorProfileButton")}
            </Button>
          </Link>
        )}
      </View>
    </View>
  );
};

const makeStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "space-evenly",
    },
    scrollView: {
      maxHeight: 380,
    },
    listSubheader: {
      textTransform: "uppercase",
      fontWeight: "bold",
      textAlign: "center",
      fontSize: 20,
      lineHeight: 28,
    },
    listItem: {
      borderColor: theme.colors.primary,
      borderWidth: 2,
      borderRadius: 16,
      paddingVertical: 16,
      paddingHorizontal: 16,
      marginVertical: 8,
      marginHorizontal: 16,
    },
    listItemTitle: {
      fontSize: 28,
      lineHeight: 36,
      marginRight: 32,
    },
    listItemDescription: {
      fontSize: 20,
      lineHeight: 28,
    },
    newProfileButtonWrapper: {
      alignItems: "center",
      gap: 16,
    },
  });

export default ProfilesList;

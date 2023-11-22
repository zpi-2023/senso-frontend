import { Link } from "expo-router";
import { useState } from "react";
import { type ImageSourcePropType, ScrollView, View } from "react-native";
import { Button, List } from "react-native-paper";

import { actions } from "@/common/actions";
import { useQuery, useMutation } from "@/common/api";
import { AppRoutes } from "@/common/constants";
import { useI18n } from "@/common/i18n";
import {
  type Profile,
  isSenior,
  isCaretaker,
  useIdentity,
  RedirectIfLoggedOut,
  type SeniorProfile,
} from "@/common/identity";
import { sty } from "@/common/styles";
import { Header, LoadingScreen } from "@/components";
import { ProfileEntry } from "@/components/profile";

const caretakerAvatar =
  require("../../assets/images/caretaker16.png") as ImageSourcePropType;
const seniorAvatar =
  require("../../assets/images/oldman16.png") as ImageSourcePropType;

const ProfilesList = () => {
  const { t } = useI18n();
  const styles = useStyles();
  const identity = useIdentity();
  const { data } = useQuery({
    url: "/api/v1/account/profiles",
  });
  const createSeniorProfile = useMutation(
    "post",
    "/api/v1/account/profiles/senior",
  );
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
    const { data: seniorProfile } = await createSeniorProfile({});

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
              <ProfileEntry
                key={p.seniorId}
                title={t("profileList.caretakerNameFallback")}
                description={`Senior: ${p.seniorAlias}`}
                onPress={() => handleItemPress(p)}
                avatar={caretakerAvatar}
              />
            );
          })}
        </ScrollView>
        {seniorProfile && (
          <>
            <List.Subheader style={styles.listSubheader}>
              {t("profileList.seniorHeader")}
            </List.Subheader>
            <ProfileEntry
              title={t("profileList.seniorNameFallback")}
              description={t("profileList.seniorDescription")}
              onPress={() => handleItemPress(seniorProfile)}
              avatar={seniorAvatar}
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

const useStyles = sty.themedHook(({ colors }) => ({
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
  newProfileButtonWrapper: {
    alignItems: "center",
    gap: 16,
  },
}));

export default ProfilesList;

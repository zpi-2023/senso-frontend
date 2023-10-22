import { Link } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";
import { Avatar, Button, List } from "react-native-paper";

import { actions } from "@/common/actions";
import { useI18n } from "@/common/i18n";
import {
  Profile,
  isSenior,
  isCaretaker,
  useIdentity,
  RedirectIfLoggedOut,
} from "@/common/identity";
import { AppRoutes } from "@/common/util/constants";
import { Header } from "@/components/Header";

const mockApiResponse = {
  profiles: [
    { type: "caretaker", seniorId: 2137, seniorAlias: "Jan Kowalski" },
    { type: "caretaker", seniorId: 123, seniorAlias: "Grzegorz Floryda" },
    { type: "senior", seniorId: 789 },
  ] as Profile[],
};

const ProfilesList = () => {
  const { t } = useI18n();
  const identity = useIdentity();

  if (!identity.isLoggedIn) {
    return <RedirectIfLoggedOut identity={identity} />;
  }

  const profiles = mockApiResponse.profiles;
  const seniorProfile = profiles.find(isSenior);
  const caretakerProfiles = profiles.filter(isCaretaker);

  const handleItemPress = (profile: Profile) => identity.selectProfile(profile);

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
          <Link href={AppRoutes.AddSeniorProfile} replace>
            <Button icon="plus" mode="contained" uppercase>
              {t("profileList.newSeniorProfileButton")}
            </Button>
          </Link>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
    borderColor: "#b9a6e5",
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

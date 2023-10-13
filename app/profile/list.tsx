import { Link, Stack } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";
import { Avatar, Button, List } from "react-native-paper";

import { useI18n } from "@/util/i18n";

const mockApiResponse = {
  profiles: [
    { type: "caretaker", seniorId: "2137", seniorAlias: "Jan Kowalski" },
    { type: "caretaker", seniorId: "123", seniorAlias: "Grzegorz Floryda" },
    { type: "senior", seniorId: "789" },
  ],
};

const ProfilesList = () => {
  const { t } = useI18n();
  const profiles = mockApiResponse.profiles;
  const seniorProfile = profiles.find(({ type }) => type === "senior");
  const hasCaretakerProfile = profiles.some(({ type }) => type === "caretaker");

  const handleItemPress = (seniorId: string) => {
    console.log(seniorId); // TODO: navigate to profile
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: t("profileList.pageTitle") }} />
      <List.Section>
        {hasCaretakerProfile && (
          <List.Subheader style={styles.listSubheader}>
            {t("profileList.caretakersHeader")}
          </List.Subheader>
        )}
        <ScrollView style={styles.scrollView}>
          {profiles
            .filter(({ type }) => type !== "senior")
            .map(({ seniorId, seniorAlias }) => {
              return (
                <List.Item
                  key={seniorId}
                  title={t("profileList.caretakerNameFallback")}
                  description={`Senior: ${seniorAlias || seniorId}`}
                  onPress={() => handleItemPress(seniorId)}
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
              onPress={() => handleItemPress(seniorProfile.seniorId)}
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
      <View style={styles.newProfileButtonWrapper}>
        <Link href="/profile/add">
          <Button icon="plus" mode="contained" uppercase>
            {t("profileList.newProfileButton")}
          </Button>
        </Link>
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
    backgroundColor: "#b9a6e5",
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
  },
});

export default ProfilesList;

import { Link, Stack } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";
import { Avatar, Button, List } from "react-native-paper";

const mockApiResponse = {
  profiles: [
    { type: "caretaker", seniorId: "2137" },
    { type: "caretaker", seniorId: "123" },
    { type: "senior", seniorId: "789" },
  ],
};

const ProfilesList = () => {
  const profiles = mockApiResponse.profiles;
  const seniorProfile = profiles.find(({ type }) => type === "senior");
  const hasCaretakerProfile = profiles.some(({ type }) => type === "caretaker");

  const handleItemPress = (seniorId: string) => {
    console.log(seniorId); // TODO: navigate to profile
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Profiles" }} />
      <List.Section>
        {hasCaretakerProfile && (
          <List.Subheader style={styles.listSubheader}>
            Caretaker profiles
          </List.Subheader>
        )}
        <ScrollView style={styles.scrollView}>
          {profiles
            .filter(({ type }) => type !== "senior")
            .map(({ seniorId }) => {
              return (
                <List.Item
                  key={seniorId}
                  title="Caretaker"
                  description={`Senior ID: ${seniorId}`}
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
              Your senior profile
            </List.Subheader>
            <List.Item
              title="Senior"
              description={`Senior ID: ${seniorProfile.seniorId}`}
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
            Add new profile
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

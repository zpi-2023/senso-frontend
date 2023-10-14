import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { IconButton, SegmentedButtons } from "react-native-paper";

type ProfileType = "caretaker" | "senior";

const ProfilesList = () => {
  const [profileType, setProfileType] = useState<ProfileType>("caretaker");

  return (
    <View style={styles.container}>
      <SegmentedButtons
        style={styles.profileType}
        value={profileType}
        onValueChange={(type) => setProfileType(type as ProfileType)}
        buttons={[
          {
            value: "caretaker",
            label: "Caretaker",
            accessibilityLabel: "Caretaker",
            icon: () => (
              <IconButton
                icon="account-heart-outline"
                size={28}
                style={{ margin: 0, padding: 0 }}
              />
            ),
            labelStyle: styles.segmentedButtonLabel,
            style: styles.segmentedButton,
          },
          {
            value: "senior",
            label: "Senior",
            accessibilityLabel: "Senior",
            icon: () => (
              <IconButton
                icon="account-injury-outline"
                size={28}
                style={{ margin: 0, padding: 0 }}
              />
            ),
            labelStyle: styles.segmentedButtonLabel,
            style: styles.segmentedButton,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  profileType: {
    marginHorizontal: 16,
  },
  segmentedButtonLabel: {
    fontSize: 24,
    lineHeight: 28,
  },
  segmentedButton: {},
});

export default ProfilesList;

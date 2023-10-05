import { Link } from "expo-router";
import { StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";

const Page = () => {
  return (
    <View style={styles.container}>
      <Text variant="displayLarge">Senso</Text>

      <Text style={styles.description}>
        Your all-in-one senior companion app that assists with everyday tasks.
      </Text>
      <Link href="/auth/login" replace>
        <Button
          mode="contained"
          labelStyle={{
            fontSize: 20,
            lineHeight: 28,
          }}
        >
          Let's get started
        </Button>
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 32,
  },
  description: {
    textAlign: "center",
    fontSize: 20,
    lineHeight: 28,
    paddingHorizontal: 32,
  },
});

export default Page;

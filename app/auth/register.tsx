import { Link } from "expo-router";
import { StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";

const Page = () => {
  return (
    <View style={styles.container}>
      <Text>Register page</Text>
      <Link href="/auth/login" replace>
        <Button>Go to login</Button>
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Page;

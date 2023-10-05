import { StyleSheet, View } from "react-native";
import { Button } from "react-native-paper";

const Page = () => {
  return (
    <View style={styles.container}>
      <Button
        icon="login-variant"
        mode="contained"
        onLongPress={() => {
          alert("You pressed the button for a long time");
        }}
      >
        Long press to login
      </Button>
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

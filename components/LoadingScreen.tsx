import { StyleSheet } from "react-native";
import { ActivityIndicator } from "react-native-paper";

import { Header } from "./Header";
import { View } from "./Themed";

type LoadingScreenProps = {
  title: string;
};

export const LoadingScreen = ({ title }: LoadingScreenProps) => (
  <View style={styles.container}>
    <Header title={title} />
    <ActivityIndicator size="large" />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
  },
});

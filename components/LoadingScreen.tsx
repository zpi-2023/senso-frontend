import { View } from "react-native";
import { ActivityIndicator } from "react-native-paper";

import { Header } from "./Header";

import { sty } from "@/common/styles";

type LoadingScreenProps = {
  title: string;
};

export const LoadingScreen = ({ title }: LoadingScreenProps) => (
  <View style={sty.center}>
    <Header title={title} />
    <ActivityIndicator size="large" />
  </View>
);

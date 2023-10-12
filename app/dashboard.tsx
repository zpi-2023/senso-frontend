import { Text } from "react-native";

import { useRequireHasProfile } from "@/common/identity";

const Page = () => {
  useRequireHasProfile();

  return <Text>Dashboard</Text>;
};

export default Page;

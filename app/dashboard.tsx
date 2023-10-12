import { Text } from "react-native";

import { useIdentity, RedirectIfNotHasProfile } from "@/common/identity";

const Page = () => {
  const identity = useIdentity();

  if (!identity.hasProfile) {
    return <RedirectIfNotHasProfile identity={identity} />;
  }

  return <Text>Dashboard</Text>;
};

export default Page;

import { Text } from "react-native";

import { useIdentity, RedirectIfNoProfile } from "@/common/identity";

const Page = () => {
  const identity = useIdentity();

  if (!identity.hasProfile) {
    return <RedirectIfNoProfile identity={identity} />;
  }

  return <Text>Dashboard</Text>;
};

export default Page;

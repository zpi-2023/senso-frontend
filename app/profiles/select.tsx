import { Text } from "react-native";
import { Button } from "react-native-paper";

import { useIdentity, useRequireLoggedIn } from "@/common/identity";

const Page = () => {
  const identity = useIdentity();

  useRequireLoggedIn();
  if (!identity.isLoggedIn) {
    return null;
  }

  return (
    <>
      <Text>Select profile</Text>
      <Button textColor="red" onPress={() => identity.logOut()}>
        DEBUG LOG OUT DEBUG
      </Button>
    </>
  );
};

export default Page;

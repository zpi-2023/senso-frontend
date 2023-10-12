import { Text } from "react-native";
import { Button } from "react-native-paper";

import { useIdentity, RedirectIfNotLoggedIn } from "@/common/identity";

const Page = () => {
  const identity = useIdentity();

  if (!identity.isLoggedIn) {
    return <RedirectIfNotLoggedIn identity={identity} />;
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

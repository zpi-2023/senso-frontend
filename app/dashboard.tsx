import { Button } from "react-native-paper";

import { useIdentity, RedirectIfNoProfile } from "@/common/identity";
import { MonoText } from "@/components/StyledText";
import { View } from "@/components/Themed";

const Page = () => {
  const identity = useIdentity();

  if (!identity.hasProfile) {
    return <RedirectIfNoProfile identity={identity} />;
  }

  return (
    <View>
      {/* TODO: This shouldn't be here */}
      <MonoText>{JSON.stringify(identity.profile, null, 2)}</MonoText>
      <Button onPress={() => identity.logOut()}>LOG OUT</Button>
    </View>
  );
};

export default Page;

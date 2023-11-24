import { useState } from "react";
import { ScrollView, View } from "react-native";
import { ActivityIndicator, Button, Text } from "react-native-paper";

import { actions } from "@/common/actions";
import { useQuery } from "@/common/api";
import { RedirectIfNoProfile, useIdentity } from "@/common/identity";
import { sty } from "@/common/styles";
import { CaretakerBanner, Header } from "@/components";

const remindersPerFragment = 5;

type FragmentProps = {
  index: number;
  seniorId: number;
};

const Fragment = ({ index, seniorId }: FragmentProps) => {
  const { data } = useQuery({
    url: "/api/v1/reminders/senior/{seniorId}",
    params: {
      path: { seniorId },
      query: {
        limit: remindersPerFragment,
        offset: index * remindersPerFragment,
      },
    },
  });

  if (!data || !data.items) {
    return <ActivityIndicator />;
  }

  return data.items.map((r) => <Text key={r.id}>{r.medicationName}</Text>);
};

const Page = () => {
  const [fragCount, setFragCount] = useState(0);
  const identity = useIdentity();

  if (!identity.hasProfile) {
    return <RedirectIfNoProfile identity={identity} />;
  }

  const { seniorId } = identity.profile;

  return (
    <View style={sty.full}>
      <Header left={actions.goBack} title="Medication" />
      <CaretakerBanner />
      <ScrollView>
        {Array.from({ length: fragCount }).map((_, i) => (
          <Fragment key={i} index={i} seniorId={seniorId} />
        ))}
      </ScrollView>
      <Button onPress={() => setFragCount((c) => c + 1)}>{"MORE"}</Button>
    </View>
  );
};

export default Page;

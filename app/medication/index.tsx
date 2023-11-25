import { useState } from "react";
import { View } from "react-native";
import { IOScrollView } from "react-native-intersection-observer";
import { ActivityIndicator, Text } from "react-native-paper";

import { actions } from "@/common/actions";
import { useQuery, useQueryInvalidation } from "@/common/api";
import { RedirectIfNoProfile, useIdentity } from "@/common/identity";
import { useRefreshControl } from "@/common/refresh";
import { sty } from "@/common/styles";
import { CaretakerBanner, Header, OnViewEnter } from "@/components";

const remindersPerFragment = 3;

type FragmentProps = {
  index: number;
  seniorId: number;
  loadMore: () => void;
};

const Fragment = ({ index, seniorId, loadMore }: FragmentProps) => {
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

  return (
    <>
      {data.items.map((r) => (
        <Text style={{ height: 200 }} key={r.id}>
          {r.medicationName}
        </Text>
      ))}
      <OnViewEnter
        handler={loadMore}
        disabled={data?.items?.length !== remindersPerFragment}
      />
    </>
  );
};

const Page = () => {
  const [fragCount, setFragCount] = useState(1);
  const identity = useIdentity();
  const invalidateReminders = useQueryInvalidation(
    "/api/v1/reminders/senior/{seniorId}",
  );
  const refreshControl = useRefreshControl(invalidateReminders);

  if (!identity.hasProfile) {
    return <RedirectIfNoProfile identity={identity} />;
  }

  const { seniorId } = identity.profile;

  return (
    <View style={sty.full}>
      <Header left={actions.goBack} title="Medication" />
      <CaretakerBanner />
      <IOScrollView refreshControl={refreshControl}>
        {Array.from({ length: fragCount }).map((_, i) => (
          <Fragment
            key={i}
            index={i}
            seniorId={seniorId}
            loadMore={() => setFragCount((c) => Math.max(c, i + 2))}
          />
        ))}
      </IOScrollView>
    </View>
  );
};

export default Page;

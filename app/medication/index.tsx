import { Text } from "react-native-paper";

import { RedirectIfNoProfile, useIdentity } from "@/common/identity";
import { PaginatedScrollView } from "@/components";

const Page = () => {
  const identity = useIdentity();

  if (!identity.hasProfile) {
    return <RedirectIfNoProfile identity={identity} />;
  }

  const { seniorId } = identity.profile;

  return (
    <PaginatedScrollView
      renderer={(item) => (
        <Text style={{ height: 100 }}>{item.medicationName}</Text>
      )}
      query={{
        url: "/api/v1/reminders/senior/{seniorId}",
        params: { path: { seniorId } },
      }}
      itemsPerPage={1}
      invalidationUrl="/api/v1/reminders/senior/{seniorId}"
    />
  );
};

export default Page;

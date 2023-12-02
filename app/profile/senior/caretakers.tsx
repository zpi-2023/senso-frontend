import { useState } from "react";
import { ScrollView, View } from "react-native";
import { IconButton, List, Menu } from "react-native-paper";

import { actions } from "@/common/actions";
import {
  useMutation,
  useQuery,
  useQueryInvalidation,
  type MethodPath,
} from "@/common/api";
import { type Translator, useI18n } from "@/common/i18n";
import { RedirectIfNoProfile, isSenior, useIdentity } from "@/common/identity";
import type { IdentityProfileKnown } from "@/common/identity/types";
import { useRefreshControl } from "@/common/refresh";
import { CaretakerBanner, Header, LoadingScreen } from "@/components";

const endpoint =
  "/api/v1/profiles/senior/caretakers" satisfies MethodPath<"get">;

type ItemProps = {
  profile: {
    accountId: number;
    displayName: string;
    email: string;
    phoneNumber?: string | null;
  };
  invalidateProfiles: () => Promise<void>;
  identity: IdentityProfileKnown;
  t: Translator;
};

const Item = ({ profile, invalidateProfiles, identity, t }: ItemProps) => {
  const [visible, setVisible] = useState(false);

  const unlink = useMutation(
    "delete",
    "/api/v1/profiles/caretaker/{seniorId}/{caretakerId}",
  );

  return (
    <List.Item
      left={(props) => <List.Icon {...props} icon="account" />}
      title={profile.displayName}
      description={`${profile.email} ${profile.phoneNumber ?? ""}`}
      right={
        isSenior(identity.profile)
          ? (props) => (
              <Menu
                anchor={
                  <IconButton
                    {...props}
                    icon="dots-vertical"
                    onPress={() => setVisible(true)}
                  />
                }
                visible={visible}
                onDismiss={() => setVisible(false)}
              >
                <Menu.Item
                  leadingIcon="link-variant-off"
                  title={t("profiles.caretakerList.unlink")}
                  onPress={async () => {
                    setVisible(false);
                    await unlink({
                      params: {
                        path: {
                          seniorId: identity.profile.seniorId,
                          caretakerId: profile.accountId,
                        },
                      },
                    });
                    await invalidateProfiles();
                  }}
                />
              </Menu>
            )
          : undefined
      }
    />
  );
};

const Page = () => {
  const { t } = useI18n();
  const identity = useIdentity();

  const { data } = useQuery({ url: endpoint });
  const invalidateProfiles = useQueryInvalidation(endpoint);
  const refreshControl = useRefreshControl(invalidateProfiles);

  if (!identity.hasProfile) {
    return <RedirectIfNoProfile identity={identity} />;
  }

  if (!data) {
    return <LoadingScreen title={t("profiles.caretakerList.pageTitle")} />;
  }

  return (
    <View>
      <Header
        left={actions.goBack}
        title={t("profiles.caretakerList.pageTitle")}
      />
      <CaretakerBanner />
      <ScrollView refreshControl={refreshControl}>
        {data.profiles.map((profile) => (
          <Item
            key={profile.accountId}
            {...{ profile, invalidateProfiles, identity, t }}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default Page;

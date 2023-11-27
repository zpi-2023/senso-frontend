import { Link } from "expo-router";
import { useCallback, useState } from "react";
import { type ImageSourcePropType, ScrollView, View } from "react-native";
import {
  Button,
  Dialog,
  List,
  Portal,
  Text,
  TextInput,
} from "react-native-paper";

import { actions } from "@/common/actions";
import { useQuery, useMutation } from "@/common/api";
import { AppRoutes } from "@/common/constants";
import { useI18n } from "@/common/i18n";
import {
  type Profile,
  isSenior,
  isCaretaker,
  useIdentity,
  RedirectIfLoggedOut,
  type SeniorProfile,
  type CaretakerProfile,
} from "@/common/identity";
import { sty } from "@/common/styles";
import { Header, LoadingScreen } from "@/components";
import { ProfileEntry } from "@/components/profile";

const caretakerAvatar =
  require("../../assets/images/caretaker16.png") as ImageSourcePropType;
const seniorAvatar =
  require("../../assets/images/oldman16.png") as ImageSourcePropType;

type DialogState =
  | { type: "hidden" }
  | {
      type: "edit-prompt";
      profile: CaretakerProfile;
      text: string;
      changeText: (text: string) => void;
    }
  | { type: "delete-alert"; profile: Profile };

const ProfilesList = () => {
  const { t } = useI18n();
  const styles = useStyles();
  const identity = useIdentity();

  const { data: profileData, mutate } = useQuery({
    url: "/api/v1/account/profiles",
  });
  const { data: caretakersData, isLoading: caretakersLoading } = useQuery({
    url: "/api/v1/account/profiles/senior/caretakers",
  });
  const createSeniorProfile = useMutation(
    "post",
    "/api/v1/account/profiles/senior",
  );
  const editCaretakerProfile = useMutation(
    "put",
    "/api/v1/account/profiles/caretaker/{seniorId}",
  );
  const deleteCaretakerProfile = useMutation(
    "delete",
    "/api/v1/account/profiles/caretaker/{seniorId}",
  );
  const deleteSeniorProfile = useMutation(
    "delete",
    "/api/v1/account/profiles/senior",
  );

  const [isCreatingSeniorProfile, setIsCreatingSeniorProfile] = useState(false);
  const { dialogState, dismissDialog, showEditPrompt, showDeleteAlert } =
    useDialogState();

  if (!identity.isLoggedIn) {
    return <RedirectIfLoggedOut identity={identity} />;
  }

  if (!profileData) {
    return <LoadingScreen title={t("profiles.list.pageTitle")} />;
  }

  const { profiles } = profileData as { profiles: Profile[] };

  const canDeleteSenior =
    !caretakersLoading && caretakersData?.profiles?.length === 0;

  const seniorProfile = profiles.find(isSenior);
  const caretakerProfiles = profiles.filter(isCaretaker);

  const handleItemPress = (profile: Profile) => identity.selectProfile(profile);

  const handleCreateSeniorProfile = async () => {
    setIsCreatingSeniorProfile(true);
    const { data: seniorProfile } = await createSeniorProfile({});

    if (!seniorProfile) {
      return; // TODO: handle error
    }

    identity.selectProfile(
      seniorProfile as SeniorProfile,
      AppRoutes.DisplaySeniorQR,
    );
    setIsCreatingSeniorProfile(false);
  };

  return (
    <View style={styles.container}>
      <Header left={actions.goBack} title={t("profiles.list.pageTitle")} />
      <List.Section>
        {caretakerProfiles.length > 0 && (
          <List.Subheader style={styles.listSubheader}>
            {t("profiles.list.caretakersHeader")}
          </List.Subheader>
        )}
        <ScrollView style={styles.scrollView}>
          {caretakerProfiles.map((p) => {
            return (
              <ProfileEntry
                key={p.seniorId}
                title={t("profiles.list.caretakerNameFallback")}
                description={`Senior: ${p.seniorAlias}`}
                avatar={caretakerAvatar}
                onPress={() => handleItemPress(p)}
                onProfileEdit={() => showEditPrompt(p)}
                onProfileDelete={() => showDeleteAlert(p)}
              />
            );
          })}
        </ScrollView>
        {seniorProfile && (
          <>
            <List.Subheader style={styles.listSubheader}>
              {t("profiles.list.seniorHeader")}
            </List.Subheader>
            <ProfileEntry
              title={t("profiles.list.seniorNameFallback")}
              description={t("profiles.list.seniorDescription")}
              avatar={seniorAvatar}
              onPress={() => handleItemPress(seniorProfile)}
              onProfileEdit={null}
              onProfileDelete={
                canDeleteSenior ? () => showDeleteAlert(seniorProfile) : null
              }
            />
          </>
        )}
      </List.Section>
      {profiles.length === 0 && (
        <List.Subheader style={styles.listSubheader}>
          {t("profiles.list.noProfiles")}
        </List.Subheader>
      )}
      <View style={styles.newProfileButtonWrapper}>
        <Link href={AppRoutes.AddCaretakerProfile}>
          <Button icon="account-eye-outline" mode="outlined" uppercase>
            {t("profiles.list.newCaretakerProfileButton")}
          </Button>
        </Link>
        {!seniorProfile && (
          <Link href={AppRoutes.DisplaySeniorQR} replace>
            <Button
              icon="plus"
              mode="contained"
              uppercase
              disabled={isCreatingSeniorProfile}
              loading={isCreatingSeniorProfile}
              onPress={handleCreateSeniorProfile}
            >
              {t("profiles.list.newSeniorProfileButton")}
            </Button>
          </Link>
        )}
      </View>
      <Portal>
        <Dialog
          visible={dialogState.type !== "hidden"}
          onDismiss={dismissDialog}
        >
          {dialogState.type === "edit-prompt" ? (
            <>
              <Dialog.Title>{t("profiles.list.editProfile")}</Dialog.Title>
              <Dialog.Content>
                <TextInput
                  mode="outlined"
                  label={t("profiles.create.caretaker.seniorAliasInputLabel")}
                  onChangeText={dialogState.changeText}
                  value={dialogState.text}
                />
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={dismissDialog}>{t("dialog.cancel")}</Button>
                <Button
                  onPress={async () => {
                    dismissDialog();
                    await editCaretakerProfile({
                      params: {
                        path: { seniorId: dialogState.profile.seniorId },
                      },
                      body: {
                        seniorAlias: dialogState.text,
                      },
                    });
                    await mutate();
                  }}
                >
                  {t("dialog.confirm")}
                </Button>
              </Dialog.Actions>
            </>
          ) : null}
          {dialogState.type === "delete-alert" ? (
            <>
              <Dialog.Title>{t("profiles.list.deleteProfile")}</Dialog.Title>
              <Dialog.Content>
                <Text variant="bodyLarge">
                  {t("profiles.list.deleteProfileDescription")}
                </Text>
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={dismissDialog}>{t("dialog.cancel")}</Button>
                <Button
                  onPress={async () => {
                    dismissDialog();
                    if (dialogState.profile.type === "senior") {
                      await deleteSeniorProfile({});
                    } else if (dialogState.profile.type === "caretaker") {
                      await deleteCaretakerProfile({
                        params: {
                          path: { seniorId: dialogState.profile.seniorId },
                        },
                      });
                    }
                    await mutate();
                  }}
                >
                  {t("dialog.confirm")}
                </Button>
              </Dialog.Actions>
            </>
          ) : null}
        </Dialog>
      </Portal>
    </View>
  );
};

const useDialogState = () => {
  const [dialogState, setDialogState] = useState<DialogState>({
    type: "hidden",
  });

  const dismissDialog = useCallback(
    () => setDialogState({ type: "hidden" }),
    [],
  );

  const changeText = useCallback(
    (text: string) =>
      setDialogState((prev) =>
        prev.type === "edit-prompt" ? { ...prev, text } : prev,
      ),
    [],
  );

  const showEditPrompt = useCallback(
    (profile: CaretakerProfile) =>
      setDialogState({
        type: "edit-prompt",
        profile,
        text: profile.seniorAlias,
        changeText,
      }),
    [changeText],
  );

  const showDeleteAlert = useCallback(
    (profile: Profile) => setDialogState({ type: "delete-alert", profile }),
    [],
  );

  return { dialogState, dismissDialog, showEditPrompt, showDeleteAlert };
};

const useStyles = sty.themedHook(({ colors }) => ({
  container: {
    flex: 1,
    justifyContent: "space-evenly",
  },
  scrollView: {
    maxHeight: 380,
  },
  listSubheader: {
    textTransform: "uppercase",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 20,
    lineHeight: 28,
  },
  newProfileButtonWrapper: {
    alignItems: "center",
    gap: 16,
  },
}));

export default ProfilesList;

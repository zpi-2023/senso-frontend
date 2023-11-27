import { useState } from "react";
import type { ImageSourcePropType } from "react-native";
import { Avatar, IconButton, List, Menu } from "react-native-paper";

import { useI18n } from "@/common/i18n";
import { sty } from "@/common/styles";

type ProfileEntryProps = {
  title: string;
  description: string;
  avatar: ImageSourcePropType;
  onPress: () => void;
  onProfileEdit: (() => void) | null;
  onProfileDelete: (() => void) | null;
};

export const ProfileEntry = ({
  title,
  description,
  avatar,
  onPress,
  onProfileEdit,
  onProfileDelete,
}: ProfileEntryProps) => {
  const styles = useStyles();
  const { t } = useI18n();

  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <List.Item
      title={title}
      description={description}
      onPress={onPress}
      style={styles.entry}
      titleStyle={styles.title}
      descriptionStyle={styles.description}
      left={(props) => <Avatar.Image {...props} size={32} source={avatar} />}
      right={(props) =>
        onProfileEdit || onProfileDelete ? (
          <Menu
            {...props}
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <IconButton
                icon="dots-vertical"
                onPress={() => setMenuVisible(true)}
              />
            }
          >
            {onProfileEdit ? (
              <Menu.Item
                onPress={() => {
                  setMenuVisible(false);
                  onProfileEdit();
                }}
                leadingIcon="account-edit"
                title={t("profiles.list.editProfile")}
              />
            ) : null}
            {onProfileDelete ? (
              <Menu.Item
                onPress={() => {
                  setMenuVisible(false);
                  onProfileDelete();
                }}
                leadingIcon="account-remove"
                title={t("profiles.list.deleteProfile")}
              />
            ) : null}
          </Menu>
        ) : null
      }
    />
  );
};

const useStyles = sty.themedHook(({ colors }) => ({
  entry: {
    borderColor: colors.primary,
    borderWidth: 2,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 28,
    lineHeight: 36,
    marginRight: 32,
  },
  description: {
    fontSize: 20,
    lineHeight: 28,
  },
}));

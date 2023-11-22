import type { ImageSourcePropType } from "react-native";
import { Avatar, List } from "react-native-paper";

import { sty } from "@/common/styles";

type ProfileEntryProps = {
  title: string;
  description: string;
  onPress: () => void;
  avatar: ImageSourcePropType;
};

export const ProfileEntry = ({
  title,
  description,
  onPress,
  avatar,
}: ProfileEntryProps) => {
  const styles = useStyles();

  return (
    <List.Item
      title={title}
      description={description}
      onPress={onPress}
      style={styles.entry}
      titleStyle={styles.title}
      descriptionStyle={styles.description}
      left={(props) => <Avatar.Image {...props} size={32} source={avatar} />}
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

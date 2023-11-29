import { router } from "expo-router";
import { View } from "react-native";
import { Text, TouchableRipple } from "react-native-paper";

import { AppRoutes } from "@/common/constants";
import { useI18n } from "@/common/i18n";
import { sty } from "@/common/styles";
import { useTheme } from "@/common/theme";
import { formatLongOffset } from "@/common/time";
import { Icon } from "@/components";
import { type Note, summarizeNote } from "@/logic/notes";

type NoteItemProps = {
  note: Note;
};

export const NoteItem = ({ note }: NoteItemProps) => {
  const { t } = useI18n();
  const theme = useTheme();
  const styles = useStyles();

  const { title, summary } = summarizeNote(note);
  const createdAt = formatLongOffset(new Date(note.createdAt), t);

  return (
    <TouchableRipple
      onPress={() =>
        router.push({
          pathname: AppRoutes.NoteDetails,
          params: { noteId: note.id },
        })
      }
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text numberOfLines={1} style={styles.headerText}>
            {title}
          </Text>
          {note.isPrivate ? (
            <Icon
              icon="shield-lock"
              iconColor={theme.colors.primary}
              size={28}
            />
          ) : null}
        </View>
        {summary.length > 0 ? (
          <Text numberOfLines={1} style={styles.summary}>
            {summary}
          </Text>
        ) : null}
        <Text style={styles.createdAt}>{createdAt}</Text>
      </View>
    </TouchableRipple>
  );
};

const useStyles = sty.themedHook(({ colors }) => ({
  container: {
    backgroundColor: "transparent",
    padding: 24,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: colors.surface,
    borderBottomColor: colors.surface,
    marginTop: -1,
  },
  header: {
    backgroundColor: "transparent",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 32,
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
  },
  summary: {
    fontSize: 18,
    paddingVertical: 8,
  },
  createdAt: {
    fontSize: 18,
    color: colors.onSurfaceDisabled,
  },
}));

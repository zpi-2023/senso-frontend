import { router } from "expo-router";
import { StyleSheet, View } from "react-native";
import {
  type MD3Theme,
  Text,
  TouchableRipple,
  useTheme,
} from "react-native-paper";

import { Icon } from "../Icon";

import { AppRoutes } from "@/common/constants";
import { useI18n } from "@/common/i18n";
import { formatDateOffset } from "@/common/time";
import { type Note, summarizeNote } from "@/logic/notes";

type NoteItemProps = {
  note: Note;
};

export const NoteItem = ({ note }: NoteItemProps) => {
  const { t } = useI18n();
  const theme = useTheme();

  const styles = makeStyles(theme);

  const { title, summary } = summarizeNote(note);
  const createdAt = formatDateOffset(new Date(note.createdAt), new Date(), t);

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

const makeStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: "transparent",
      padding: 24,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderTopColor: theme.colors.surface,
      borderBottomColor: theme.colors.surface,
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
      color: theme.colors.onSurfaceDisabled,
    },
  });

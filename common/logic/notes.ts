import { useQuery } from "../api";
import type { Translator } from "../i18n";
import { useIdentity } from "../identity";

const dayInMs = 1000 * 60 * 60 * 24;
const extractedTitleLength = 20;

export type Note = {
  id: number;
  content: string;
  createdAt: string;
  isPrivate: boolean;
  title?: string | null;
};

export const formatNoteCreationDate = (
  createdAt: string,
  now: Date,
  t: Translator,
) => {
  const date = new Date(createdAt);
  const daysAgo = Math.floor((now.getTime() - date.getTime()) / dayInMs);

  switch (daysAgo) {
    case 0:
      return t("time.today");
    case 1:
      return t("time.yesterday");
    default:
      return date.toISOString().split("T")[0];
  }
};

export const summarizeNote = (note: Note) => {
  const title = note.title;
  const content = note.content.replace(/\s+/g, " ");

  if (title) {
    return { title, summary: content };
  }

  if (content.length <= extractedTitleLength) {
    return { title: content, summary: "" };
  }

  const extractedTitle =
    note.content.substring(0, extractedTitleLength) + "...";
  const remainingContent = "..." + note.content.substring(extractedTitleLength);

  return {
    title: extractedTitle,
    summary: remainingContent,
  };
};

export const notePageTitle = (note: Note) => {
  if (note.title) {
    return note.title;
  }

  if (note.content.length <= extractedTitleLength) {
    return note.content;
  }

  return note.content.substring(0, extractedTitleLength) + "...";
};

export const useNoteList = (): Note[] | null => {
  const identity = useIdentity();

  const { data } = useQuery(
    identity.hasProfile
      ? {
          url: "/api/v1/notes/senior/{seniorId}",
          params: { path: { seniorId: identity.profile.seniorId } },
        }
      : null,
  );

  return data?.notes ?? null;
};

export const useNote = (noteId: number | null): Note | null => {
  const { data } = useQuery(
    noteId
      ? {
          url: "/api/v1/notes/{noteId}",
          params: { path: { noteId } },
        }
      : null,
  );

  return data ?? null;
};

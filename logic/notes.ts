import { useLocalSearchParams } from "expo-router";
import { useCallback } from "react";

import { useMutation, useQuery, useQueryInvalidation } from "../common/api";
import type { Translator } from "../common/i18n";
import { useIdentity } from "../common/identity";

const dayInMs = 1000 * 60 * 60 * 24;
const extractedTitleLength = 20;

const SENIOR_NOTES_URL = "/api/v1/notes/senior/{seniorId}" as const;
const NOTE_DETAILS_URL = "/api/v1/notes/{noteId}" as const;
const CREATE_NOTE_URL = "/api/v1/notes" as const;

export type Note = {
  id: number;
  content: string;
  createdAt: string;
  isPrivate: boolean;
  title?: string | null;
};

export type NoteEdit = Pick<Note, "content" | "isPrivate" | "title">;

export const formatNoteCreationDate = (
  createdAt: string,
  now: Date,
  t: Translator,
) => {
  const date = new Date(createdAt);
  const daysAgo = Math.trunc((now.getTime() - date.getTime()) / dayInMs);

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

export const useNoteList = (): {
  notes: Note[] | null;
  refresh: () => Promise<void>;
} => {
  const identity = useIdentity();

  const { data, mutate } = useQuery(
    identity.hasProfile
      ? {
          url: SENIOR_NOTES_URL,
          params: { path: { seniorId: identity.profile.seniorId } },
        }
      : null,
  );

  return { notes: data?.notes ?? null, refresh: mutate };
};

export const useNote = (
  noteId: number | null,
): {
  note: Note | null;
  editNote: (body: NoteEdit) => Promise<void>;
  deleteNote: () => Promise<void>;
} => {
  const refreshNoteList = useQueryInvalidation(SENIOR_NOTES_URL);
  const { data, mutate } = useQuery(
    noteId
      ? {
          url: NOTE_DETAILS_URL,
          params: { path: { noteId } },
        }
      : null,
  );

  const editMutation = useMutation("put", NOTE_DETAILS_URL);
  const deleteMutation = useMutation("delete", NOTE_DETAILS_URL);

  const note = data ?? null;
  const editNote = useCallback(
    async (body: NoteEdit) => {
      if (note) {
        const { response, data } = await editMutation({
          params: { path: { noteId: note.id } },
          body,
        });
        if (response.ok) {
          await mutate(data);
          await refreshNoteList();
        }
      }
    },
    [note, editMutation, mutate, refreshNoteList],
  );
  const deleteNote = useCallback(async () => {
    if (note) {
      await deleteMutation({ params: { path: { noteId: note.id } } });
      await refreshNoteList();
    }
  }, [note, deleteMutation, refreshNoteList]);

  return { note, editNote, deleteNote };
};

export const useCreateNote = (): ((body: NoteEdit) => Promise<Note | null>) => {
  const createMutation = useMutation("post", CREATE_NOTE_URL);
  const refreshNoteList = useQueryInvalidation(SENIOR_NOTES_URL);
  return async (body: NoteEdit) => {
    const { response, data } = await createMutation({ body });
    if (response.ok) {
      await refreshNoteList();
    }
    return data ?? null;
  };
};

export const useNoteIdParam = (): number | null => {
  const { noteId: noteIdString } = useLocalSearchParams<{ noteId: string }>();
  const noteId = noteIdString ? parseInt(noteIdString, 10) : null;
  return Number.isNaN(noteId) ? null : noteId;
};

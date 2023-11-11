import { useLocalSearchParams } from "expo-router";
import { useCallback } from "react";
import { useSWRConfig } from "swr";

import { useMutation, useQuery } from "../api";
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

export type NoteEdit = Pick<Note, "content" | "isPrivate" | "title">;

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

const useRefreshNoteList = (): (() => Promise<void>) => {
  const { mutate } = useSWRConfig();
  return useCallback(async () => {
    await mutate(
      (key) =>
        Array.isArray(key) && key[0] === "/api/v1/notes/senior/{seniorId}",
    );
  }, [mutate]);
};

export const useNote = (
  noteId: number | null,
): {
  note: Note | null;
  editNote: (body: NoteEdit) => Promise<void>;
  deleteNote: () => Promise<void>;
} => {
  const refreshNoteList = useRefreshNoteList();
  const { data, mutate } = useQuery(
    noteId
      ? {
          url: "/api/v1/notes/{noteId}",
          params: { path: { noteId } },
        }
      : null,
  );

  const editMutation = useMutation("put", "/api/v1/notes/{noteId}");
  const deleteMutation = useMutation("delete", "/api/v1/notes/{noteId}");

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
  const createMutation = useMutation("post", "/api/v1/notes");
  const refreshNoteList = useRefreshNoteList();
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

import { useLocalSearchParams } from "expo-router";
import { useCallback } from "react";

import {
  type MethodPath,
  useMutation,
  useQuery,
  useQueryInvalidation,
} from "@/common/api";
import { useIdentity } from "@/common/identity";

const extractedTitleLength = 20;

const seniorNotesUrl =
  "/api/v1/notes/senior/{seniorId}" satisfies MethodPath<"get">;
const noteDetailsUrl = "/api/v1/notes/{noteId}" satisfies MethodPath<"get">;
const createNoteUrl = "/api/v1/notes" satisfies MethodPath<"post">;

export type Note = {
  id: number;
  content: string;
  createdAt: string;
  isPrivate: boolean;
  title?: string | null;
};

export type NoteEdit = Pick<Note, "content" | "isPrivate" | "title">;

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
          url: seniorNotesUrl,
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
  const refreshNoteList = useQueryInvalidation(seniorNotesUrl);
  const { data, mutate } = useQuery(
    noteId
      ? {
          url: noteDetailsUrl,
          params: { path: { noteId } },
        }
      : null,
  );

  const editMutation = useMutation("put", noteDetailsUrl);
  const deleteMutation = useMutation("delete", noteDetailsUrl);

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
  const createMutation = useMutation("post", createNoteUrl);
  const refreshNoteList = useQueryInvalidation(seniorNotesUrl);
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

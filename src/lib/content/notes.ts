import "server-only";

import { notes } from "#content";

import { byDateDesc, isPublished } from "./collection";

const publishedNotes = notes.filter(isPublished).sort(byDateDesc);

/** Published notes, newest first. */
export const getNotes = () => publishedNotes;

export const getNote = (slug: string) =>
  publishedNotes.find((note) => note.slug === slug);

import { cache } from "react";
import { notes } from "#content";

export const getNotes = cache(() => {
  return [...notes].sort((a, b) => b.date.localeCompare(a.date));
});

export const findNote = (slug: string) => {
  return notes.find((note) => note.slug === slug);
};

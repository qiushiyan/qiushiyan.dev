import { getCollection } from "astro:content";

import { byDateDesc, isPublished } from "./articles";
import type { CollectionEntry } from "astro:content";

export type Note = CollectionEntry<"notes">;

/** Published notes, newest first. */
export const getNotes = async () =>
  (await getCollection("notes", isPublished)).sort(byDateDesc);

/** Notes grouped by category, categories in alphabetical order with "Other" last. */
export const groupNotesByCategory = (notes: Note[]) => {
  const groups = Map.groupBy(notes, (note) => note.data.category);
  const categories = [...groups.keys()].sort((a, b) =>
    a === "Other" ? 1 : b === "Other" ? -1 : a.localeCompare(b)
  );
  return categories.map((category) => ({
    category,
    notes: groups.get(category)!,
  }));
};

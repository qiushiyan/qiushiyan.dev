import "server-only";

import { markdownToPlainText } from "@/lib/plain-text";
import { getNotes } from "./notes";
import { getPosts } from "./posts";

export type SearchEntry = {
  title: string;
  description: string;
  href: string;
  kind: "post" | "note";
};

/** The fields site search needs from every published post and note. */
export const getSearchIndex = (): SearchEntry[] => [
  ...getPosts().map((post) => ({
    title: post.title,
    description: markdownToPlainText(post.description),
    href: post.href,
    kind: "post" as const,
  })),
  ...getNotes().map((note) => ({
    title: note.title,
    description: note.category,
    href: note.href,
    kind: "note" as const,
  })),
];

import type { PipelineFrontmatter } from "@/lib/markdown/types";
import type { CollectionEntry } from "astro:content";

/** A post or a note: both render through src/layouts/article-layout.astro. */
export type Article = CollectionEntry<"posts"> | CollectionEntry<"notes">;

/** Drafts show in development and are left out of production builds. */
export const isPublished = (entry: { data: { draft: boolean } }) =>
  import.meta.env.DEV || !entry.data.draft;

export const byDateDesc = (
  a: { data: { date: Date } },
  b: { data: { date: Date } }
) => b.data.date.valueOf() - a.data.date.valueOf();

/** The fields the Markdown pipeline adds (src/lib/markdown/types.ts), from `render(entry)`. */
export const pipelineFrontmatter = (frontmatter: Record<string, unknown>) =>
  frontmatter as unknown as PipelineFrontmatter;

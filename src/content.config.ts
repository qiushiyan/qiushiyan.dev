import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { slug as slugify } from "github-slugger";

import { renderInlineMarkdown } from "@/lib/content/markdown";

/** The `headings` list Quarto writes to frontmatter, with titles as phrasing HTML for the TOC. */
const headings = z
  .array(z.object({ title: z.string(), slug: z.string(), depth: z.number() }))
  .default([])
  .transform((list) =>
    Promise.all(
      list.map(async ({ title, slug, depth }) => ({
        slug,
        depth,
        html: await renderInlineMarkdown(title),
      }))
    )
  );

/** Entries are keyed by their frontmatter slug, or the slugified title. */
const generateId = ({ data }: { data: Record<string, unknown> }) =>
  typeof data.slug === "string" ? data.slug : slugify(String(data.title));

const posts = defineCollection({
  loader: glob({ pattern: "*/index.md", base: "./content/posts", generateId }),
  schema: z
    .object({
      title: z.string(),
      date: z.coerce.date(),
      slug: z.string().optional(),
      draft: z.boolean().default(false),
      tags: z.array(z.string()).default(["other"]),
      description: z.string(),
      headings,
      /** Islands the post renders (see src/components/content-islands.astro). */
      components: z.array(z.string()).default([]),
    })
    .transform(async (data) => ({
      ...data,
      descriptionHtml: await renderInlineMarkdown(data.description),
    })),
});

export const collections = { posts };

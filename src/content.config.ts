import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { defineCollection } from "astro:content";
import { file, glob } from "astro/loaders";
import { z } from "astro/zod";
import { slug as slugify } from "github-slugger";
import { parse as parseYaml } from "yaml";

import { htmlToPlainText, renderInlineMarkdown } from "@/lib/markdown/inline";

/*
  The site's content model. Posts and notes are Quarto's Markdown output in
  content/; recipes are source files listed in content/recipes/index.yaml.
  Read entries through src/lib/content/*, which hides drafts in production.
*/

/** The `headings` list Quarto writes to frontmatter, with each title rendered for the table of contents. */
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

/** Fields posts and notes share. */
const article = {
  title: z.string(),
  date: z.coerce.date(),
  slug: z.string().optional(),
  /** Drafts show in development only. */
  draft: z.boolean().default(false),
  headings,
};

/** Entries are keyed by their frontmatter slug, or else the slugified title. */
const generateId = ({ data }: { data: Record<string, unknown> }) =>
  typeof data.slug === "string" ? data.slug : slugify(String(data.title));

const posts = defineCollection({
  loader: glob({ pattern: "*/index.md", base: "./content/posts", generateId }),
  schema: z
    .object({
      ...article,
      tags: z.array(z.string()).default(["other"]),
      /** One line of Markdown, rendered to `descriptionHtml`. */
      description: z.string(),
    })
    .transform(async (data) => {
      const descriptionHtml = await renderInlineMarkdown(data.description);
      return {
        ...data,
        descriptionHtml,
        descriptionText: htmlToPlainText(descriptionHtml),
      };
    }),
});

/** Notes have no summary of their own; describe them by the topics (H2s) they cover. */
const describeNote = (noteHeadings: { html: string; depth: number }[]) => {
  const topics = noteHeadings
    .filter((heading) => heading.depth === 2)
    .map((heading) => htmlToPlainText(heading.html));
  // Topics such as "Resource Hints: Preconnect, Prefetch, and Preload" have
  // commas of their own, so the list falls back to semicolons.
  const separator = topics.some((topic) => topic.includes(",")) ? "; " : ", ";
  const listed = topics.slice(0, 3);
  const rest = topics.length - listed.length;
  return rest > 0
    ? `Notes on ${listed.join(separator)}${separator}and ${rest} more topics.`
    : `Notes on ${new Intl.ListFormat("en").format(listed)}.`;
};

const notes = defineCollection({
  loader: glob({ pattern: "*/index.md", base: "./content/notes", generateId }),
  schema: z
    .object({
      ...article,
      category: z.string().default("Other"),
      description: z.string().optional(),
    })
    .transform((data) => ({
      ...data,
      description: data.description ?? describeNote(data.headings),
    })),
});

/**
 * One entry per recipe, keyed `<group>/<slug>` (e.g. `python/polymorphism-over-if-else`),
 * with the source of each listed file.
 */
const recipes = defineCollection({
  loader: file("./content/recipes/index.yaml", {
    parser: (text) => {
      const groups = parseYaml(text) as Record<
        string,
        { title: string; slug: string; files: string[] }[]
      >;
      return Object.entries(groups).flatMap(([group, list]) =>
        list.map((recipe) => ({
          id: `${group}/${recipe.slug}`,
          group,
          ...recipe,
        }))
      );
    },
  }),
  schema: z
    .object({
      group: z.string(),
      title: z.string(),
      slug: z.string(),
      files: z.array(z.string()).min(1),
    })
    .transform(async (data) => ({
      ...data,
      files: await Promise.all(
        data.files.map(async (path) => ({
          name: path.split("/").pop()!,
          source: await readFile(
            join(process.cwd(), "content/recipes", path),
            "utf8"
          ),
        }))
      ),
    })),
});

export const collections = { posts, notes, recipes };

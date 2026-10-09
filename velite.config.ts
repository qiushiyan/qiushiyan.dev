import { readFile } from "fs/promises";
import path from "path";
import { slug as slugify } from "github-slugger";
import remarkHeadingAttrs from "remark-heading-attrs";
import { defineCollection, defineConfig, s } from "velite";

import { createHtmlProcessor } from "@/lib/content/processor";
import { rehypeCodeInline } from "@/lib/content/rehype-code";
import { articleContent, headings, timestamp } from "@/lib/content/schema";
import { routes } from "@/lib/navigation";

const descriptionProcessor = createHtmlProcessor([rehypeCodeInline]);

const about = defineCollection({
  name: "about",
  pattern: "about.md",
  single: true,
  schema: s.object({
    content: s.markdown(),
  }),
});

/** Fields shared by posts and notes. */
const articleFields = {
  title: s.string(),
  date: s.isodate(),
  slug: s.string().optional(),
  lastModified: timestamp(),
  draft: s.boolean().optional().default(false),
  headings: headings(),
  /** Lazily loaded registry components the content uses (see components-registry.tsx). */
  components: s.array(s.string()).optional(),
  content: articleContent(),
};

const posts = defineCollection({
  name: "Post",
  pattern: "./posts/**/*.md",
  schema: s
    .object({
      ...articleFields,
      tags: s.array(s.string()).optional().default(["other"]),
      description: s.string(),
      metadata: s.metadata(),
    })
    .transform(async (data) => {
      const slug = data.slug || slugify(data.title);
      return {
        ...data,
        slug,
        href: routes.post(slug),
        descriptionHtml: String(
          await descriptionProcessor.process(data.description)
        ),
      };
    }),
});

const plainText = (html: string) =>
  html
    .replace(/<[^>]*>/g, "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");

/** Notes have no summary of their own; list the topics they cover. */
const describeNote = (noteHeadings: { html: string; depth: number }[]) => {
  const topics = noteHeadings
    .filter((heading) => heading.depth === 2)
    .map((heading) => plainText(heading.html));
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
  name: "Note",
  pattern: "./notes/**/*.md",
  schema: s
    .object({
      ...articleFields,
      category: s.string(),
      description: s.string().optional(),
    })
    .transform((data) => {
      const slug = data.slug || slugify(data.title);
      return {
        ...data,
        slug,
        href: routes.note(slug),
        description: data.description ?? describeNote(data.headings),
      };
    }),
});

const recipeSchema = s.object({
  title: s.string(),
  slug: s.string(),
  description: s.string().optional(),
  files: s.array(s.string()),
});

const readRecipeFile = async (file: string) => ({
  filename: path.basename(file),
  content: await readFile(
    path.join(process.cwd(), "content", "recipes", file),
    "utf8"
  ),
});

export const recipes = defineCollection({
  name: "Recipe",
  pattern: "./recipes/index.yaml",
  single: true,
  schema: s
    .record(s.string(), s.array(recipeSchema))
    .transform(async (groups) =>
      Object.fromEntries(
        await Promise.all(
          Object.entries(groups).map(
            async ([group, list]) =>
              [
                group,
                await Promise.all(
                  list.map(async (recipe) => ({
                    ...recipe,
                    codes: await Promise.all(recipe.files.map(readRecipeFile)),
                  }))
                ),
              ] as const
          )
        )
      )
    ),
});

export default defineConfig({
  root: "content",
  collections: {
    about,
    posts,
    recipes,
    notes,
  },
  markdown: {
    remarkPlugins: [remarkHeadingAttrs],
  },
});

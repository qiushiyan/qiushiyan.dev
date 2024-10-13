import { readFile } from "fs/promises";
import path from "path";

import { htmlProcessor } from "@/lib/content/processor";
import { timestamp } from "@/lib/content/schema";
import { routes } from "@/lib/navigation";
import { slug } from "github-slugger";
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import remarkDirective from "remark-directive";
import remarkHeadingAttrs from "remark-heading-attrs";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import remarkUnwrapImages from "remark-unwrap-images";
import { unified } from "unified";
import { defineCollection, defineConfig, s } from "velite";

import {
  rehypeCode,
  rehypeCodeInline,
  rehypeUnwrapImages,
  remarkUseDirective,
} from "./src/lib/content/plugins";

const descriptionProcessor = unified().use([
  remarkParse,
  remarkRehype,
  rehypeRaw,
  rehypeCodeInline,
  rehypeStringify,
]);

const home = defineCollection({
  name: "home",
  pattern: "home.md",
  single: true,
  schema: s.object({
    content: s.markdown(),
  }),
});

const about = defineCollection({
  name: "about",
  pattern: "about.md",
  single: true,
  schema: s.object({
    content: s.markdown(),
  }),
});

const posts = defineCollection({
  name: "Post",
  pattern: "./posts/**/*.md",
  schema: s
    .object({
      title: s.string(),
      date: s.isodate(),
      slug: s.string().optional(),
      tags: s.array(s.string()).optional().default(["other"]),
      description: s.string(),
      metadata: s.metadata(),
      lastModified: timestamp(),
      draft: s.boolean().optional().default(false),
      headings: s
        .array(
          s.object({
            title: s.string(),
            slug: s.string(),
            depth: s.number(),
          })
        )
        .default([])
        .transform((headings) =>
          headings.map((heading) => ({
            html: htmlProcessor.processSync(heading.title).toString(),
            slug: heading.slug,
            depth: heading.depth,
          }))
        ),
      components: s.array(s.string()).optional(),
      content: s.markdown({
        remarkPlugins: [
          remarkDirective,
          remarkUseDirective,
          remarkUnwrapImages,
        ],
        rehypePlugins: [rehypeCode, rehypeUnwrapImages],
      }),
    })
    .transform((data) => {
      const postSlug = data.slug || slug(data.title);
      return {
        ...data,
        descriptionHtml: descriptionProcessor
          .processSync(data.description)
          .toString(),
        slug: postSlug,
        href: routes.post(postSlug),
      };
    }),
});

const notes = defineCollection({
  name: "Note",
  pattern: "./notes/**/*.md",
  schema: s
    .object({
      title: s.string(),
      date: s.isodate(),
      slug: s.string().optional(),
      lastModified: timestamp(),
      draft: s.boolean().optional().default(false),
      headings: s
        .array(
          s.object({
            title: s.string(),
            slug: s.string(),
            depth: s.number(),
          })
        )
        .default([])
        .transform((headings) =>
          headings.map((heading) => ({
            html: htmlProcessor.processSync(heading.title).toString(),
            slug: heading.slug,
            depth: heading.depth,
          }))
        ),
      components: s.array(s.string()).optional(),
      content: s.markdown({
        remarkPlugins: [
          remarkDirective,
          remarkUseDirective,
          remarkUnwrapImages,
        ],
        rehypePlugins: [rehypeCode, rehypeUnwrapImages],
      }),
    })
    .transform((data) => {
      const noteSlug = data.slug || slug(data.title);
      return {
        ...data,
        slug: noteSlug,
        href: routes.note(noteSlug),
      };
    }),
});

const RecipeSchema = s.object({
  title: s.string(),
  slug: s.string(),
  description: s.string().optional(),
  files: s.array(s.string()),
  codes: s
    .array(
      s.object({
        filename: s.string(),
        content: s.string(),
      })
    )
    .optional(),
});

export const recipes = defineCollection({
  name: "Recipe",
  pattern: "./recipes/index.yaml",
  single: true,
  schema: s
    .record(s.string(), s.array(RecipeSchema))
    .transform(async (data) => {
      for (const [group, langRecipes] of Object.entries(data)) {
        const newRecipes = [];
        for (const recipe of langRecipes) {
          const codes = recipe.files.map(async (p) => {
            const file = await readFile(
              path.join(process.cwd(), "content", "recipes", p)
            );
            return {
              filename: path.basename(p),
              content: file.toString(),
            };
          });
          recipe.codes = await Promise.all(codes);
          newRecipes.push(recipe);
        }
        // @ts-ignore
        data[group] = newRecipes;
      }

      return data;
    }),
});

export default defineConfig({
  root: "content",
  collections: {
    home,
    about,
    posts,
    recipes,
    notes,
  },
  markdown: {
    remarkPlugins: [remarkHeadingAttrs],
  },
});

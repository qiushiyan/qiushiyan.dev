import { timestamp } from "@/lib/content/schema";
import Slugger from "github-slugger";
import remarkDirective from "remark-directive";
import remarkUnwrapImages from "remark-unwrap-images";
import { defineCollection, defineConfig, s } from "velite";

import {
  rehypeCode,
  rehypeCodeInline,
  remarkUseDirective,
} from "./src/lib/content/plugins";

const slugger = new Slugger();

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
      description: s.markdown({
        rehypePlugins: [rehypeCodeInline],
      }),
      metadata: s.metadata(),
      lastModified: timestamp(),
      draft: s.boolean().optional().default(false),
      content: s.markdown({
        copyLinkedFiles: true,
        remarkPlugins: [
          remarkDirective,
          remarkUseDirective,
          remarkUnwrapImages,
        ],
        rehypePlugins: [rehypeCode],
      }),
    })
    .transform((data) => ({
      ...data,
      slug: data.slug || slugger.slug(data.title),
    })),
});

export default defineConfig({
  root: "content",
  collections: {
    home,
    posts,
    about,
  },
  markdown: {
    remarkPlugins: [],
  },
});

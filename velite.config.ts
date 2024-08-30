import { timestamp } from "@/lib/content/schema";
import Slugger from "github-slugger";
import remarkDirective from "remark-directive";
import remarkUnwrapImages from "remark-unwrap-images";
import { defineCollection, defineConfig, s } from "velite";

import { rehypeCode, remarkUseDirective } from "./src/lib/content/plugins";

const slugger = new Slugger();

const home = defineCollection({
  name: "home",
  pattern: "home.md",
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
      description: s.string(),
      metadata: s.metadata(),
      lastModified: timestamp(),
      draft: s.boolean().optional().default(false),
      content: s.markdown({
        copyLinkedFiles: true,
        remarkPlugins: [remarkUnwrapImages],
        rehypePlugins: [rehypeCode],
      }),
    })
    .transform((data, { meta }) => ({
      ...data,
      slug: data.slug || slugger.slug(data.title),
    })),
});

export default defineConfig({
  root: "content",
  collections: {
    home,
    posts,
  },
  markdown: {
    remarkPlugins: [remarkDirective, remarkUseDirective],
  },
});

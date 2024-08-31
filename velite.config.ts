import { timestamp } from "@/lib/content/schema";
import remarkDirective from "remark-directive";
import remarkUnwrapImages from "remark-unwrap-images";
import { defineCollection, defineConfig, s } from "velite";

import {
  rehypeCode,
  rehypeCodeInline,
  rehypeUnwrapImages,
  remarkUseDirective,
} from "./src/lib/content/plugins";

const slug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

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
        remarkPlugins: [
          remarkDirective,
          remarkUseDirective,
          remarkUnwrapImages,
        ],
        rehypePlugins: [rehypeCode, rehypeUnwrapImages],
      }),
    })
    .transform((data) => ({
      ...data,
      slug: data.slug || slug(data.title),
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

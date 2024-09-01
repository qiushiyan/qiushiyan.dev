import { timestamp } from "@/lib/content/schema";
import { slug } from "github-slugger";
import remarkDirective from "remark-directive";
import remarkHeadingAttrs from "remark-heading-attrs";
import remarkUnwrapImages from "remark-unwrap-images";
import { defineCollection, defineConfig, s } from "velite";

import { extractToc } from "./headings";
import {
  rehypeCode,
  rehypeCodeInline,
  rehypeUnwrapImages,
  remarkUseDirective,
} from "./src/lib/content/plugins";

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
    .transform((data, { meta }) => {
      return {
        ...data,
        slug: data.slug || slug(data.title),
        headings: extractToc(meta.value as Uint8Array),
      };
    }),
});

export default defineConfig({
  root: "content",
  collections: {
    home,
    posts,
    about,
  },
  markdown: {
    remarkPlugins: [remarkHeadingAttrs],
  },
});

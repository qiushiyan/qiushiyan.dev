import { PythonScriptLoader, RScriptLoader } from "@/lib/content/loaders";
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
        .transform((headings) =>
          headings.map((heading) => ({
            html: htmlProcessor.processSync(heading.title).toString(),
            slug: heading.slug,
            depth: heading.depth,
          }))
        ),
      raw: s.raw(),
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

export const recipes = defineCollection({
  name: "Recipe",
  pattern: "./recipes/**/*.{py,r}",
  schema: s
    .object({
      title: s.string().optional(),
      code: s.string(),
      lang: s.enum(["python", "r"]),
    })
    .transform((data, { meta }) => {
      return {
        ...data,
        slug: meta.basename?.replace(/\.[^.]+$/, "") as string,
        filename: meta.basename as string,
      };
    }),
});

export default defineConfig({
  root: "content",
  collections: {
    home,
    about,
    posts,
    recipes,
  },
  markdown: {
    remarkPlugins: [remarkHeadingAttrs],
  },
  loaders: [PythonScriptLoader, RScriptLoader],
});

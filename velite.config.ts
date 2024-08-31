import { timestamp } from "@/lib/content/schema";
import { Heading, Node as MdastNode, Root as MdastRoot } from "mdast";
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

const getHeadings = (tree: MdastRoot) => {
  const headings: { depth: 2 | 3; title: string; slug: string }[] = [];

  function extractHeadingText(node: Heading): string {
    return node.children
      .filter((child) => child.type === "text")
      .map((child) => (child as { value: string }).value)
      .join(" ");
  }

  const visitor = (node: MdastNode) => {
    if (node.type === "heading") {
      const heading = node as Heading;
      if (heading.depth === 2 || heading.depth === 3) {
        const title = extractHeadingText(heading);
        headings.push({
          depth: heading.depth as 2 | 3,
          title,
          slug: slug(title),
        });
      }
    }

    if ("children" in node && Array.isArray(node.children)) {
      node.children.forEach((child) => visitor(child as MdastNode));
    }
  };

  visitor(tree);

  return headings;
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
    .transform((data, { meta }) => {
      return {
        ...data,
        slug: data.slug || slug(data.title),
        headings: meta.mdast ? getHeadings(meta.mdast) : [],
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
    remarkPlugins: [],
  },
});

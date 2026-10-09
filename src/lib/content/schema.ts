import { execFile } from "node:child_process";
import { promisify } from "node:util";
import remarkDirective from "remark-directive";
import remarkUnwrapImages from "remark-unwrap-images";
import { defineSchema, s } from "velite";

import {
  rehypeImageSize,
  rehypeUnwrapBlocks,
  remarkCloseCustomElements,
  remarkUseDirective,
} from "./plugins";
import { inlineHtmlProcessor } from "./processor";
import { rehypeCode } from "./rehype-code";

const execFileAsync = promisify(execFile);

/**
 * The file's last commit date, or undefined outside a git checkout. A
 * shallow clone (the default in some CI builders) only has one commit, so
 * every page would report the clone date: build from a full clone.
 */
export const timestamp = defineSchema(() =>
  s
    .custom<string | undefined>((i) => i === undefined || typeof i === "string")
    .transform<string | undefined>(async (value, { meta, addIssue }) => {
      if (value != null) {
        addIssue({
          fatal: false,
          code: "custom",
          message:
            "`timestamp()` ignores the frontmatter value and reads the file's last commit date",
        });
      }
      const date = await execFileAsync("git", [
        "log",
        "-1",
        "--format=%cI",
        "--",
        meta.path,
      ]).then(
        ({ stdout }) => stdout.trim(),
        () => ""
      );
      return date ? new Date(date).toISOString() : undefined;
    })
);

/**
 * The frontmatter `headings` list (written by the Quarto export script),
 * with each title rendered to phrasing HTML for the table of contents.
 */
export const headings = defineSchema(() =>
  s
    .array(
      s.object({
        title: s.string(),
        slug: s.string(),
        depth: s.number(),
      })
    )
    .default([])
    .transform((list) =>
      list.map(({ title, slug, depth }) => ({
        slug,
        depth,
        html: String(inlineHtmlProcessor.processSync(title)),
      }))
    )
);

/** The Markdown body of a post or note, with the site's code and layout plugins. */
export const articleContent = defineSchema(() =>
  s.markdown({
    remarkPlugins: [
      remarkDirective,
      remarkUseDirective,
      remarkCloseCustomElements,
      remarkUnwrapImages,
    ],
    rehypePlugins: [rehypeCode, rehypeUnwrapBlocks, rehypeImageSize],
  })
);

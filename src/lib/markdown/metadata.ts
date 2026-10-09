import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { toString } from "mdast-util-to-string";

import type { Root } from "mdast";
import type { AstroFile } from "./types";

const execFileAsync = promisify(execFile);

/**
 * Adds `lastModified` (the file's last commit) and `readingTime` (minutes) to
 * the entry's frontmatter; pages read them from `remarkPluginFrontmatter`.
 * A shallow clone has one commit, so every page would report the clone date:
 * build from a full clone.
 */
export const remarkArticleMetadata =
  () => async (tree: Root, file: AstroFile) => {
    const frontmatter = ((file.data.astro ??= {}).frontmatter ??= {});
    // Velite's formula, kept so reading times didn't change in the move: 265 words a minute.
    const words =
      toString(tree).match(/['’]?([a-zA-Z]+(?:['’]?[a-zA-Z]+)*)/g) ?? [];
    frontmatter.readingTime = Math.max(1, Math.round(words.length / 265));
    const date = await execFileAsync("git", [
      "log",
      "-1",
      "--format=%cI",
      "--",
      file.path,
    ]).then(
      ({ stdout }) => stdout.trim(),
      () => ""
    );
    if (date) frontmatter.lastModified = new Date(date).toISOString();
  };

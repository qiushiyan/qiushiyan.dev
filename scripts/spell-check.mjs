// Spell-checks the prose of every post, note and the about page.
// Markdown is parsed first, so code, HTML, link targets and frontmatter are
// skipped; only text nodes reach the spell checker.
//
//   pnpm spellcheck              all of content/
//   pnpm spellcheck <file>...    only the given Markdown files
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dictionary from "dictionary-en";
import glob from "fast-glob";
import remarkDirective from "remark-directive";
import remarkHeadingAttrs from "remark-heading-attrs";
import remarkParse from "remark-parse";
import remarkRetext from "remark-retext";
import retextEnglish from "retext-english";
import retextIndefiniteArticle from "retext-indefinite-article";
import retextSpell from "retext-spell";
import { unified } from "unified";
import { visit } from "unist-util-visit";
import { VFile } from "vfile";
import { reporter } from "vfile-reporter";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

// Frontmatter is metadata, not prose; strip it before remark parses the file.
const FRONTMATTER = /^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/;

// Bare URLs and domains such as web.dev are not prose.
const URL_LIKE =
  /\b(?:https?:\/\/|www\.)\S+|\b[\w-]+(?:\.[a-z]{2,})+(?:\/\S*)?/g;

// Hunspell can't know acronyms (DOM, LCP) or units (768px, 16ms).
const isAcronymOrUnit = (word) => /^[A-Z]{2,}s?$|\d/.test(word);

/** Blanks out URLs in text nodes, keeping their length so positions hold. */
const remarkBlankUrls = () => (tree) => {
  visit(tree, "text", (node) => {
    node.value = node.value.replace(URL_LIKE, (url) => " ".repeat(url.length));
  });
};

const processor = unified()
  .use(remarkParse)
  .use(remarkDirective)
  .use(remarkHeadingAttrs)
  .use(remarkBlankUrls)
  .use(
    remarkRetext,
    unified()
      .use(retextEnglish)
      .use(retextSpell, { dictionary })
      .use(retextIndefiniteArticle)
  );

const args = process.argv.slice(2);
const paths = args.length
  ? args.map((file) => path.resolve(file))
  : await glob("content/**/*.md", { cwd: root, absolute: true });

const files = await Promise.all(
  paths.sort().map(async (filePath) => {
    const markdown = await readFile(filePath, "utf8");
    // Blank out frontmatter instead of removing it, so line numbers still
    // match the file.
    const value = markdown.replace(FRONTMATTER, (match) =>
      match.replace(/[^\n]/g, "")
    );
    const file = new VFile({ path: path.relative(root, filePath), value });
    await processor.run(processor.parse(file), file);
    file.messages = file.messages.filter(
      (message) =>
        message.source !== "retext-spell" || !isAcronymOrUnit(message.actual)
    );
    return file;
  })
);

console.log(reporter(files, { quiet: true }) || "No spelling issues found.");
process.exitCode = files.some((file) => file.messages.length) ? 1 : 0;

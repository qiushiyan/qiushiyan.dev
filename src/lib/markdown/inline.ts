import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { createHighlighter } from "shiki";
import { unified } from "unified";
import { visit } from "unist-util-visit";

import { codeThemeDark, codeThemeLight } from "./code-themes";
import type { Element, ElementContent, Root } from "hast";

/*
  Highlighted inline code, and one-line Markdown (descriptions, TOC titles,
  code captions) rendered to phrasing HTML.
*/

const highlighter = createHighlighter({
  themes: [codeThemeLight, codeThemeDark],
  langs: [],
});

const INLINE_LANG = /^[a-z0-9+#-]+$/;

/**
 * `_ts`code`_` or `*ts`code`*` → <code class="code-inline"> highlighted in
 * both code themes. The light colours are inline; `.dark` switches to
 * `--shiki-dark` (src/styles/highlight.css).
 */
export const rehypeInlineCode = () => async (tree: Root) => {
  const targets: { node: Element; lang: string; value: string }[] = [];
  visit(tree, "element", (node) => {
    if (node.tagName !== "em" || node.children.length !== 2) return;
    const [lang, code] = node.children;
    if (
      lang.type !== "text" ||
      !INLINE_LANG.test(lang.value) ||
      code.type !== "element" ||
      code.tagName !== "code" ||
      code.children.length !== 1 ||
      code.children[0].type !== "text"
    ) {
      return;
    }
    targets.push({ node, lang: lang.value, value: code.children[0].value });
  });
  if (targets.length === 0) return;

  const shiki = await highlighter;
  for (const { node, lang, value } of targets) {
    const language = await shiki.loadLanguage(lang as never).then(
      () => lang,
      () => "text"
    );
    const root = shiki.codeToHast(value, {
      lang: language,
      themes: { light: codeThemeLight.name, dark: codeThemeDark.name },
      defaultColor: "light",
      structure: "inline",
    });
    node.tagName = "code";
    node.properties = { className: ["code-inline"] };
    node.children = root.children as ElementContent[];
  }
};

/** A <p> around a single line, unwrapped: titles and captions take phrasing content. */
const rehypeUnwrapParagraph = () => (tree: Root) => {
  const content = tree.children.filter(
    (child) => !(child.type === "text" && child.value.trim() === "")
  );
  const [only] = content;
  if (content.length === 1 && only.type === "element" && only.tagName === "p") {
    tree.children = only.children;
  }
};

const inlineProcessor = unified()
  .use(remarkParse)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeRaw)
  .use(rehypeUnwrapParagraph)
  .use(rehypeInlineCode)
  .use(rehypeStringify);

/** One line of Markdown → phrasing HTML, with inline code highlighted. */
export const renderInlineMarkdown = async (markdown: string) =>
  String(await inlineProcessor.process(markdown));

const syncInlineProcessor = unified()
  .use(remarkParse)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeRaw)
  .use(rehypeUnwrapParagraph);

/** One line of Markdown → hast nodes, synchronously (no highlighting), for use inside a rehype pass. */
export const inlineMarkdownToHast = (markdown: string) =>
  (syncInlineProcessor.runSync(syncInlineProcessor.parse(markdown)) as Root)
    .children as ElementContent[];

/** Plain text of rendered inline HTML, for meta tags, feeds and OG images. */
export const htmlToPlainText = (html: string) =>
  html
    .replace(/<[^>]*>/g, "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();

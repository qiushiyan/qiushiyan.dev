import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

import type { Root } from "hast";
import type { PluggableList } from "unified";

/** Markdown to HTML for short frontmatter strings, with extra rehype plugins. */
export const createHtmlProcessor = (rehypePlugins: PluggableList = []) =>
  unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeRaw)
    .use(rehypePlugins)
    .use(rehypeStringify);

/**
 * Markdown wraps a single line in <p>. Heading titles and captions are
 * rendered inside <a>, <h1> or <figcaption>, which take phrasing content.
 */
const rehypeUnwrapParagraph = () => (tree: Root) => {
  const content = tree.children.filter(
    (child) => !(child.type === "text" && child.value.trim() === "")
  );
  const [only] = content;
  if (content.length === 1 && only.type === "element" && only.tagName === "p") {
    tree.children = only.children;
  }
};

/** One line of Markdown to phrasing HTML, e.g. `Using the <code>knitr</code> Engine`. */
export const inlineHtmlProcessor = createHtmlProcessor([rehypeUnwrapParagraph]);

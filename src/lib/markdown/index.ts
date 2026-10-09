import { unified } from "@astrojs/markdown-remark";
import rehypeRaw from "rehype-raw";
import remarkHeadingAttrs from "remark-heading-attrs";
import remarkUnwrapImages from "remark-unwrap-images";

import { rehypeCodeMeta, rehypeCodeSwitcher } from "./code-blocks";
import { rehypeCustomElements } from "./custom-elements";
import { rehypeInlineCode } from "./inline";
import { remarkArticleMetadata } from "./metadata";
import { remarkCloseCustomElements, remarkRawImages } from "./raw-html";

export { expressiveCodeOptions } from "./expressive-code";

/*
  The Markdown pipeline for everything in content/ (Quarto's GFM output).
  Astro runs these plugins during content sync, in Node; Expressive Code's
  rehype plugin is appended after them by its integration.

    remark: {#id} headings → raw HTML fixes → image unwrapping → metadata
    rehype: parse raw HTML → code switchers → code meta → custom elements → inline code
*/
export const markdownProcessor = unified({
  // Quarto already writes typographic quotes and dashes.
  smartypants: false,
  remarkPlugins: [
    remarkHeadingAttrs,
    remarkCloseCustomElements,
    remarkRawImages,
    remarkUnwrapImages,
    remarkArticleMetadata,
  ],
  // Astro parses raw HTML only after these run; the custom elements need it first.
  rehypePlugins: [
    rehypeRaw,
    rehypeCodeSwitcher,
    rehypeCodeMeta,
    rehypeCustomElements,
    rehypeInlineCode,
  ],
});

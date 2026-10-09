import { readFile } from "node:fs/promises";
import { h } from "hastscript";
import { SKIP, visit } from "unist-util-visit";
import { assets, getImageMetadata } from "velite";

import type { Root } from "hast";
import type { Root as MdastRoot } from "mdast";

/*
  Structural Markdown plugins. Code highlighting lives in ./rehype-code.ts.
*/

/** Renders `:::name{attrs}` directives as `<name attrs>` elements for the component registry. */
export const remarkUseDirective = () => (tree: MdastRoot) => {
  visit(tree, (node) => {
    if (
      node.type === "containerDirective" ||
      node.type === "leafDirective" ||
      node.type === "textDirective"
    ) {
      const data = (node.data ??= {});
      const hast = h(node.name, node.attributes ?? {});
      data.hName = hast.tagName;
      data.hProperties = hast.properties;
    }
  });
};

/*
  HTML has no self-closing custom elements: the parser reads
  `<do-counter-example />` as an open tag, and everything after it becomes
  its children, which the component then drops. Rewrite them as explicit
  open and close tags before rehype-raw parses the HTML.
*/
const SELF_CLOSING_CUSTOM_ELEMENT = /<([a-z][\w]*-[\w-]*)(\s[^<>]*?)?\s*\/>/g;

export const remarkCloseCustomElements = () => (tree: MdastRoot) => {
  visit(tree, "html", (node) => {
    node.value = node.value.replace(
      SELF_CLOSING_CUSTOM_ELEMENT,
      (_, name: string, attributes = "") => `<${name}${attributes}></${name}>`
    );
  });
};

/*
  Elements the registry renders as blocks (<figure>, <div>, <table>). Markdown
  wraps an element written on its own line, or inline with text, in <p>,
  and a block inside <p> is invalid HTML that React fails to hydrate.
*/
const BLOCK_TAGS = new Set([
  "img",
  "iframe",
  "my-callout",
  "my-steps",
  "code-switcher",
  "do-counter-example",
  "quiz-table-example",
]);

/** Replaces a `<p>` whose only content is a block element with that element. */
export const rehypeUnwrapBlocks = () => (tree: Root) => {
  visit(tree, "element", (node, index, parent) => {
    if (node.tagName !== "p" || !parent || index === undefined) return;
    const content = node.children.filter(
      (child) => !(child.type === "text" && child.value.trim() === "")
    );
    const [only] = content;
    if (
      content.length === 1 &&
      only.type === "element" &&
      BLOCK_TAGS.has(only.tagName)
    ) {
      parent.children.splice(index, 1, only);
      return [SKIP, index];
    }
  });
};

/*
  Intrinsic size for local images, so the page reserves the right space
  before they load. Velite's copy step runs first and rewrites `src` to
  `/static/<name>`; its `assets` map points each name back to the source file.
  An image that already has both dimensions (Quarto's `{width= height=}`)
  keeps them: they are the display size the author chose.
*/
export const rehypeImageSize = () => async (tree: Root) => {
  const tasks: Promise<void>[] = [];
  visit(tree, "element", (node) => {
    const { src, width, height } = node.properties;
    if (node.tagName !== "img" || typeof src !== "string") return;
    if (width !== undefined && height !== undefined) return;
    const file = assets.get(src.replace(/^\/static\//, ""));
    if (!src.startsWith("/static/") || !file) return;
    tasks.push(
      readFile(file)
        .then((buffer) => getImageMetadata(buffer))
        .then((metadata) => {
          if (!metadata) return;
          node.properties.width = metadata.width;
          node.properties.height = metadata.height;
        })
    );
  });
  await Promise.all(tasks);
};

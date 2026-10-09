import { visit } from "unist-util-visit";

import type { Root } from "mdast";

/*
  Fixes for raw HTML in Quarto's output, at the Markdown stage (before the
  HTML is parsed).
*/

/*
  HTML has no self-closing custom elements: the parser reads
  `<do-counter-example />` as an open tag and swallows what follows. Rewrite
  them as open and close tags.
*/
const SELF_CLOSING_CUSTOM_ELEMENT = /<([a-z][\w]*-[\w-]*)(\s[^<>]*?)?\s*\/>/g;

export const remarkCloseCustomElements = () => (tree: Root) => {
  visit(tree, "html", (node) => {
    node.value = node.value.replace(
      SELF_CLOSING_CUSTOM_ELEMENT,
      (_, name: string, attributes = "") => `<${name}${attributes}></${name}>`
    );
  });
};

/*
  Quarto writes an image with attributes (`{.wider width=…}`) as a raw <img>,
  which Astro's image pipeline skips: its relative path would break and the
  file would ship unoptimised. As a Markdown image node it is collected,
  resized and fingerprinted like `![](…)`, keeping its attributes.
*/
const RAW_IMG = /^<img\s([^<>]*?)\/?>$/i;
const ATTRIBUTE = /([\w-]+)="([^"]*)"/g;

export const remarkRawImages = () => (tree: Root) => {
  visit(tree, "html", (node, index, parent) => {
    const match = node.value.trim().match(RAW_IMG);
    if (!match || !parent || index === undefined) return;
    const attributes = Object.fromEntries(
      [...match[1].matchAll(ATTRIBUTE)].map(([, name, value]) => [name, value])
    );
    const { src, alt = "", class: className, ...rest } = attributes;
    if (!src || /^(https?:)?\/\//.test(src) || src.startsWith("/")) return;
    parent.children[index] = {
      type: "image",
      url: src,
      alt,
      data: {
        hProperties: {
          ...rest,
          ...(className && { className: className.split(" ") }),
        },
      },
    };
  });
};

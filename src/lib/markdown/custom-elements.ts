import { h } from "hastscript";
import { SKIP, visit } from "unist-util-visit";

import { isInteractiveElement } from "./elements";
import type { Element, Root } from "hast";
import type { AstroFile } from "./types";

/*
  Raw HTML elements in Quarto's output. Static ones become plain HTML here
  (styled in src/styles/content.css); interactive ones (elements.ts) stay as
  custom elements and are recorded in the entry's `elements` frontmatter, so
  the page loads their scripts.
*/

const infoIcon = () =>
  h(
    "svg",
    {
      ariaHidden: "true",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      className: ["callout-icon"],
    },
    [
      h("circle", { cx: 12, cy: 12, r: 10 }),
      h("path", { d: "M12 16v-4" }),
      h("path", { d: "M12 8h.01" }),
    ]
  );

const staticElements: Record<string, (node: Element) => Element> = {
  /** `<my-callout title="…">`: an aside set off from the body text. */
  "my-callout": (node) =>
    h("aside.callout", [
      h("p.callout-title", [
        infoIcon(),
        String(node.properties.title ?? "Note"),
      ]),
      ...node.children,
    ]),
  /** `<my-steps>`: each <h4> inside starts a numbered step. */
  "my-steps": (node) => h("div.steps", node.children),
  /** An embedded page, with a plain link out beneath it. */
  iframe: (node) => {
    const { src, title, caption, height } = node.properties;
    return h("figure.embed", [
      h("iframe", {
        src,
        title: String(title ?? caption ?? "Embedded page"),
        loading: "lazy",
        style: `height: ${height ?? "min(80dvh, 48rem)"}`,
      }),
      h("figcaption", [
        h("span", caption ? String(caption) : ""),
        src
          ? h(
              "a",
              { href: src, target: "_blank", rel: "noreferrer" },
              "Open in new tab"
            )
          : "",
      ]),
    ]);
  },
  /** An image, captioned with its alt text. `.wider` images grow into the right-hand track. */
  img: (node) => {
    const alt = String(node.properties.alt ?? "");
    const wide = (node.properties.className as string[] | undefined)?.includes(
      "wider"
    );
    return h("figure.image", { className: wide ? ["wider"] : [] }, [
      {
        ...node,
        properties: {
          ...node.properties,
          loading: node.properties.loading ?? "lazy",
          decoding: "async",
        },
      },
      alt ? h("figcaption", alt) : "",
    ]);
  },
};

// Block-level output: Markdown wraps an element written on its own line in a
// <p>, and a block inside <p> is invalid HTML.
const isBlock = (name: string) =>
  name in staticElements || isInteractiveElement(name);

export const rehypeCustomElements = () => (tree: Root, file: AstroFile) => {
  const used = new Set<string>();
  visit(tree, "element", (node, index, parent) => {
    if (!parent || index === undefined) return;
    if (node.tagName === "p") {
      const content = node.children.filter(
        (child) => !(child.type === "text" && child.value.trim() === "")
      );
      const [only] = content;
      if (
        content.length === 1 &&
        only.type === "element" &&
        isBlock(only.tagName)
      ) {
        parent.children[index] = only;
        return [SKIP, index];
      }
      return;
    }
    const transform = staticElements[node.tagName];
    if (transform) {
      parent.children[index] = transform(node);
    } else if (isInteractiveElement(node.tagName)) {
      used.add(node.tagName);
    } else if (node.tagName.includes("-")) {
      console.warn(
        `[content] ${file.path}: <${node.tagName}> is not a known content element; it renders as an empty tag.`
      );
    }
  });
  const frontmatter = ((file.data.astro ??= {}).frontmatter ??= {});
  frontmatter.elements = [...used];
};

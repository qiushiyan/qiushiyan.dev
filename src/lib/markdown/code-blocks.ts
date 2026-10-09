import { h } from "hastscript";
import { SKIP, visit } from "unist-util-visit";

import { inlineMarkdownToHast } from "./inline";
import type { Element, Root } from "hast";

/*
  Fenced code blocks, prepared for Expressive Code, which renders them later
  in the pipeline:
    leading `#| filename:` → the frame title
    leading `#| caption:`  → a <figure> + <figcaption> around the block
    <code-switcher> of several blocks → tabs, one per block, labelled by filename
  Code Hike's comment annotations inside the code (!mark, !collapse, !callout)
  are read by the Expressive Code plugin in code-annotations.ts.
*/

// Pandoc writes ```default for fences it can't attribute to a language.
const langAliases: Record<string, string> = { default: "markdown" };

// Only these keys are read, so Quarto chunk options such as `#| echo: false`
// stay visible in the posts about Quarto.
const META_LINE = /^#\|\s*(filename|caption):\s*(.*)$/;

const codeOf = (pre: Element) => {
  const [code] = pre.children;
  return pre.children.length === 1 && code.type === "element" && code.tagName === "code"
    ? code
    : undefined;
};

/** Leading `#| filename:` / `#| caption:` lines, removed from the code. */
const takeCodeMeta = (code: Element) => {
  const [text] = code.children;
  if (code.children.length !== 1 || text.type !== "text") return {};
  const lines = text.value.split("\n");
  const meta: { filename?: string; caption?: string } = {};
  let start = 0;
  for (; start < lines.length; start++) {
    const match = lines[start].match(META_LINE);
    if (!match) break;
    meta[match[1] as "filename" | "caption"] = match[2].trim();
  }
  text.value = lines.slice(start).join("\n");
  return meta;
};

const fixLang = (code: Element) => {
  const classes = (code.properties.className as string[] | undefined) ?? [];
  code.properties.className = classes.map((name) => {
    const lang = name.replace(/^language-/, "");
    return lang in langAliases ? `language-${langAliases[lang]}` : name;
  });
};

const langOf = (code: Element) =>
  String((code.properties.className as string[] | undefined)?.[0] ?? "").replace(/^language-/, "");

export const rehypeCodeMeta = () => (tree: Root) => {
  visit(tree, "element", (node, index, parent) => {
    if (node.tagName === "code-switcher") return SKIP;
    if (node.tagName !== "pre" || !parent || index === undefined) return;
    const code = codeOf(node);
    if (!code) return;
    fixLang(code);
    const { filename, caption } = takeCodeMeta(code);
    if (filename) {
      code.data = {
        ...code.data,
        meta: `title="${filename.replace(/"/g, "&quot;")}"`,
      };
    }
    if (caption) {
      parent.children[index] = h("figure.code-figure", [
        node,
        h("figcaption", inlineMarkdownToHast(caption)),
      ]);
      return SKIP;
    }
  });
};

/**
 * `<code-switcher>` around several fenced blocks → the WAI-ARIA tabs markup.
 * The element's script (src/components/content-elements/code-switcher.astro)
 * makes the tabs switchable; without JavaScript the first tab shows.
 */
export const rehypeCodeSwitcher = () => (tree: Root) => {
  let count = 0;
  visit(tree, "element", (node) => {
    if (node.tagName !== "code-switcher") return;
    const blocks = node.children.flatMap((child) => {
      if (child.type !== "element" || child.tagName !== "pre") return [];
      const code = codeOf(child);
      if (!code) return [];
      fixLang(code);
      const { filename } = takeCodeMeta(code);
      return [{ pre: child, label: filename ?? langOf(code) }];
    });
    const id = `code-switcher-${++count}`;
    node.properties = {};
    node.children = [
      h(
        "div.code-switcher-tabs",
        { role: "tablist", ariaLabel: "Files" },
        blocks.map(({ label }, i) =>
          h(
            "button",
            {
              type: "button",
              role: "tab",
              id: `${id}-tab-${i}`,
              ariaControls: `${id}-panel-${i}`,
              ariaSelected: i === 0 ? "true" : "false",
              tabIndex: i === 0 ? 0 : -1,
            },
            label,
          ),
        ),
      ),
      ...blocks.map(({ pre }, i) =>
        h(
          "div.code-switcher-panel",
          {
            role: "tabpanel",
            id: `${id}-panel-${i}`,
            ariaLabelledby: `${id}-tab-${i}`,
            hidden: i !== 0,
          },
          [pre],
        ),
      ),
    ];
    return SKIP;
  });
};

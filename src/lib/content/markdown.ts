import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { h } from "hastscript";
import { toString } from "mdast-util-to-string";
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { createHighlighter } from "shiki";
import { unified } from "unified";
import { SKIP, visit } from "unist-util-visit";

import { codeThemeDark, codeThemeLight } from "./code-themes";

import type { Element, ElementContent, Root } from "hast";
import type { Root as MdastRoot } from "mdast";
import type { VFile } from "vfile";

/*
  Markdown plugins for posts and notes. Content is Quarto's GFM output, so the
  custom elements it contains (<my-callout>, <my-steps>, <code-switcher>) are
  raw HTML. They become plain HTML here, before Expressive Code renders the
  code blocks inside them.
*/

const execFileAsync = promisify(execFile);

type AstroFile = VFile & {
  data: { astro?: { frontmatter?: Record<string, unknown> } };
};

/**
 * `lastModified` (the file's last commit, so builds need a full clone) and
 * `readingTime` in minutes, added to the entry's frontmatter.
 */
export const remarkArticleMetadata =
  () => async (tree: MdastRoot, file: AstroFile) => {
    const frontmatter = (file.data.astro ??= {}).frontmatter ?? {};
    file.data.astro.frontmatter = frontmatter;
    // Velite's formula, so reading times don't change in the move: 265 words a minute.
    const words = toString(tree).match(/['\u2019]?([a-zA-Z]+(?:['\u2019]?[a-zA-Z]+)*)/g) ?? [];
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

/*
  HTML has no self-closing custom elements: the parser reads
  `<do-counter-example />` as an open tag and swallows what follows. Rewrite
  them as open and close tags before rehype-raw parses the HTML.
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
  Quarto writes an image with attributes (`{.wider width=…}`) as a raw
  <img>, which Astro's image pipeline skips: its relative path would break
  and the file would ship unoptimised. As a Markdown image node it is
  collected, resized and fingerprinted like `![](…)`, keeping its attributes.
*/
const RAW_IMG = /^<img\s([^<>]*?)\/?>$/i;
const ATTRIBUTE = /([\w-]+)="([^"]*)"/g;

export const remarkRawImages = () => (tree: MdastRoot) => {
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
        hProperties: { ...rest, ...(className && { className: className.split(" ") }) },
      },
    };
  });
};

/* ── Code blocks ─────────────────────────────────────────────────────── */

// Pandoc writes ```default for fences it can't attribute to a language.
const langAliases: Record<string, string> = { default: "markdown" };

const META_LINE = /^#\|\s*(filename|caption):\s*(.*)$/;

const codeOf = (pre: Element) => {
  const [code] = pre.children;
  return pre.children.length === 1 &&
    code.type === "element" &&
    code.tagName === "code"
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

const escapeMeta = (value: string) => value.replace(/"/g, "&quot;");

/**
 * `#| filename:` becomes Expressive Code's frame title, and `#| caption:` a
 * <figcaption> around the block. Inside a code switcher the filename labels
 * the tab instead.
 */
export const rehypeCodeMeta = () => (tree: Root) => {
  visit(tree, "element", (node, index, parent) => {
    if (node.tagName === "code-switcher") return SKIP;
    if (node.tagName !== "pre" || !parent || index === undefined) return;
    const code = codeOf(node);
    if (!code) return;
    fixLang(code);
    const { filename, caption } = takeCodeMeta(code);
    if (filename) {
      code.data = { ...code.data, meta: `title="${escapeMeta(filename)}"` };
    }
    if (caption) {
      parent.children[index] = h("figure.code-figure", [
        node,
        h("figcaption", inlineMarkdown(caption)),
      ]);
      return SKIP;
    }
  });
};

let switcherCount = 0;

/**
 * `<code-switcher>` around several fenced blocks → tabs, one per block,
 * labelled with its filename. `<code-tabs>` (src/components/code-tabs.astro)
 * makes them switchable; without JavaScript the first tab shows.
 */
export const rehypeCodeSwitcher = () => (tree: Root) => {
  visit(tree, "element", (node) => {
    if (node.tagName !== "code-switcher") return;
    const blocks = node.children.flatMap((child) => {
      if (child.type !== "element" || child.tagName !== "pre") return [];
      const code = codeOf(child);
      if (!code) return [];
      fixLang(code);
      const { filename } = takeCodeMeta(code);
      const lang = String(
        (code.properties.className as string[] | undefined)?.[0] ?? ""
      ).replace(/^language-/, "");
      return [{ pre: child, label: filename ?? lang }];
    });
    const id = `code-tabs-${++switcherCount}`;
    node.tagName = "code-tabs";
    node.properties = {};
    node.children = [
      h(
        "div.code-tabs-list",
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
            label
          )
        )
      ),
      ...blocks.map(({ pre }, i) =>
        h(
          "div.code-tabs-panel",
          {
            role: "tabpanel",
            id: `${id}-panel-${i}`,
            ariaLabelledby: `${id}-tab-${i}`,
            hidden: i !== 0,
          },
          [pre]
        )
      ),
    ];
    return SKIP;
  });
};

/* ── Custom elements ─────────────────────────────────────────────────── */

const infoIcon = h(
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

const transforms: Record<string, (node: Element) => Element> = {
  "my-callout": (node) =>
    h("aside.callout", [
      h("p.callout-title", [
        structuredClone(infoIcon),
        String(node.properties.title ?? "Note"),
      ]),
      ...node.children,
    ]),
  "my-steps": (node) => h("div.steps", node.children),
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
          ? h("a", { href: src, target: "_blank", rel: "noreferrer" }, "Open in new tab")
          : "",
      ]),
    ]);
  },
  img: (node) => {
    const alt = String(node.properties.alt ?? "");
    const wide = (node.properties.className as string[] | undefined)?.includes("wider");
    return h(
      "figure.image",
      { className: wide ? ["wider"] : [] },
      [
        { ...node, properties: { ...node.properties, loading: node.properties.loading ?? "lazy", decoding: "async" } },
        alt ? h("figcaption", alt) : "",
      ]
    );
  },
};

const BLOCK_TAGS = new Set([...Object.keys(transforms), "code-tabs"]);

/** Custom elements → HTML, and a <p> around a lone block element unwrapped. */
export const rehypeCustomElements = () => (tree: Root) => {
  visit(tree, "element", (node, index, parent) => {
    if (!parent || index === undefined) return;
    if (node.tagName === "p") {
      const content = node.children.filter(
        (child) => !(child.type === "text" && child.value.trim() === "")
      );
      const [only] = content;
      if (content.length === 1 && only.type === "element" && BLOCK_TAGS.has(only.tagName)) {
        parent.children[index] = only;
        return [SKIP, index];
      }
      return;
    }
    const transform = transforms[node.tagName];
    if (transform) parent.children[index] = transform(node);
  });
};

/* ── Highlighted inline code ─────────────────────────────────────────── */

const highlighter = createHighlighter({
  themes: [codeThemeLight, codeThemeDark],
  langs: [],
});

const INLINE_LANG = /^[a-z0-9+#-]+$/;

/**
 * `_ts`code`_` or `*ts`code`*` → <code> highlighted in both themes. The light
 * colours are inline; `.dark` switches to `--shiki-dark` (see highlight.css).
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

/* ── Frontmatter strings ─────────────────────────────────────────────── */

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

/** One line of Markdown → phrasing HTML (descriptions, TOC titles), with inline code highlighted. */
export const renderInlineMarkdown = async (markdown: string) =>
  String(await inlineProcessor.process(markdown));

/** Synchronous variant for captions inside the rehype pass (no highlighting). */
const syncInlineProcessor = unified()
  .use(remarkParse)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeRaw)
  .use(rehypeUnwrapParagraph);

const inlineMarkdown = (markdown: string) =>
  (syncInlineProcessor.runSync(syncInlineProcessor.parse(markdown)) as Root)
    .children as ElementContent[];

import { highlight } from "codehike/code";
import { SKIP, visit } from "unist-util-visit";

import { encodeAttribute } from "@/components/codehike/encoding";
import { inlineHtmlProcessor } from "./processor";
import { renderCodeHtml } from "./render-code";
import { tailwindCodeTheme } from "./tailwind-code-theme";
import type { HighlightedTokens } from "@/components/codehike/highlighted";
import type { Element, Root } from "hast";

/*
  Code blocks, code switchers and highlighted inline code.

  Markdown code becomes custom elements that the component registry renders:
    <pre><code class="language-ts">   → <code-block value lang filename caption html>
    <code-switcher> of several <pre>s → <code-switcher data='[{ lang, code, filename, html }]'>
    *ts`code`* or _ts`code`_           → <code-inline value lang highlighted>

  A block's `value` and `html` and a switcher's `data` are base64-encoded
  (see components/codehike/encoding.ts).

  Highlighting runs here, at Velite build time in Node. CodeHike's highlighter
  needs WASM, which Cloudflare Workers can't run. Blocks are rendered to HTML
  here too (see render-code.tsx); inline code keeps its tokens, which the
  component renders. Nothing calls `highlight()` at runtime.
*/

/** Code with no language (a bare ``` fence) is plain text. */
const normalizeLang = (lang: string | undefined) => lang?.trim() || "text";

/** Tokens for rendering, plus `code`: the source without annotation comments, for copying. */
const highlightCode = async (
  value: string,
  lang: string
): Promise<{ highlighted: HighlightedTokens; code: string }> => {
  const result = await highlight({ value, lang, meta: "" }, tailwindCodeTheme);
  const { tokens, annotations, themeName, style } = result;
  return {
    highlighted: { tokens, annotations, lang: result.lang, themeName, style },
    code: result.code,
  };
};

// Pandoc writes ```default for fences it can't attribute to a language.
const langAliases: Record<string, string> = { default: "markdown" };

const getLang = (code: Element) => {
  const className = code.properties.className;
  const first = Array.isArray(className) ? className[0] : className;
  if (typeof first !== "string" || !first.startsWith("language-")) {
    return undefined;
  }
  const lang = first.slice("language-".length);
  return langAliases[lang] ?? lang;
};

const getText = (element: Element) => {
  const [child] = element.children;
  return element.children.length === 1 && child.type === "text"
    ? child.value
    : undefined;
};

/*
  Leading `#| key: value` lines configure the block. Only known keys are
  read, so Quarto chunk options such as `#| echo: false` stay in the code
  that posts about Quarto show.
*/
const META_KEYS = ["filename", "caption"] as const;
type CodeMeta = Partial<Record<(typeof META_KEYS)[number], string>>;
const META_LINE = /^#\|\s*([\w-]+):\s*(.*)$/;
const isMetaKey = (key: string): key is keyof CodeMeta =>
  (META_KEYS as readonly string[]).includes(key);

export const parseCodeMeta = (value: string) => {
  const lines = value.split("\n");
  const meta: CodeMeta = {};
  let start = 0;
  for (; start < lines.length; start++) {
    const match = lines[start].match(META_LINE);
    if (!match || !isMetaKey(match[1])) break;
    meta[match[1]] = match[2].trim();
  }
  return { meta, code: lines.slice(start).join("\n") };
};

/** `<pre><code class="language-x">` → `<code-block>`, or undefined if `pre` isn't plain code. */
const toCodeBlock = (pre: Element): Element | undefined => {
  const [code] = pre.children;
  if (
    pre.children.length !== 1 ||
    code.type !== "element" ||
    code.tagName !== "code"
  ) {
    return undefined;
  }
  const text = getText(code);
  if (text === undefined) return undefined;

  const { meta, code: value } = parseCodeMeta(text);
  return {
    type: "element",
    tagName: "code-block",
    properties: {
      value,
      lang: normalizeLang(getLang(code)),
      filename: meta.filename,
      caption: meta.caption
        ? String(inlineHtmlProcessor.processSync(meta.caption))
        : undefined,
    },
    children: [],
  };
};

const INLINE_LANG = /^[a-z0-9+#-]+$/;

/** `<em>ts<code>x</code></em>` → `<code-inline lang="ts" value="x">`. */
const toInlineCode = (em: Element): Element | undefined => {
  const [lang, code] = em.children;
  if (
    em.children.length !== 2 ||
    lang.type !== "text" ||
    !INLINE_LANG.test(lang.value) ||
    code.type !== "element" ||
    code.tagName !== "code"
  ) {
    return undefined;
  }
  const value = getText(code);
  if (value === undefined) return undefined;
  return {
    type: "element",
    tagName: "code-inline",
    properties: { value, lang: lang.value },
    children: [],
  };
};

type SwitcherEntry = {
  lang: string;
  code: string;
  filename?: string;
  /** The rendered <pre>, absent only if highlighting failed */
  html?: string;
};

const convertInlineCode = (tree: Root) => {
  visit(tree, "element", (node, index, parent) => {
    if (node.tagName !== "em" || !parent || index === undefined) return;
    const inline = toInlineCode(node);
    if (inline) parent.children.splice(index, 1, inline);
  });
};

const warn = (label: string) => (error: unknown) => {
  console.warn(`Pre-highlight failed for ${label}:`, error);
};

/**
 * Highlights every code element in place. A block whose highlighting fails
 * keeps its plain-text fallback: no `html`, raw `value`.
 */
const highlightElements = async (tree: Root) => {
  const tasks: Promise<void>[] = [];

  visit(tree, "element", (node) => {
    const { value, lang } = node.properties;
    const source = String(value ?? "");
    const language = normalizeLang(typeof lang === "string" ? lang : undefined);

    if (node.tagName === "code-inline") {
      tasks.push(
        highlightCode(source, language)
          .then(({ highlighted }) => {
            node.properties.highlighted = JSON.stringify(highlighted);
          })
          .catch(warn("code-inline"))
      );
    }

    if (node.tagName === "code-block") {
      tasks.push(
        highlightCode(source, language)
          .then(({ highlighted, code }) => {
            // The copy button copies `value`: the code without `// !mark` and friends.
            node.properties.value = encodeAttribute(code);
            node.properties.html = encodeAttribute(renderCodeHtml(highlighted));
          })
          .catch((error: unknown) => {
            warn("code-block")(error);
            node.properties.value = encodeAttribute(source);
          })
      );
    }

    if (node.tagName === "code-switcher") {
      const entries = JSON.parse(
        String(node.properties.data ?? "[]")
      ) as SwitcherEntry[];
      tasks.push(
        Promise.all(
          entries.map((entry) =>
            highlightCode(entry.code, entry.lang).then(
              ({ highlighted, code }) => ({
                ...entry,
                code,
                html: renderCodeHtml(highlighted),
              }),
              (error: unknown) => {
                warn("code-switcher")(error);
                return entry;
              }
            )
          )
        ).then((rendered) => {
          node.properties.data = encodeAttribute(JSON.stringify(rendered));
        })
      );
    }
  });

  await Promise.all(tasks);
};

/** Rehype plugin for article bodies: code blocks, switchers and inline code. */
export const rehypeCode = () => async (tree: Root) => {
  visit(tree, "element", (node, index, parent) => {
    if (node.tagName === "code-switcher") {
      const entries: SwitcherEntry[] = node.children.flatMap((child) => {
        if (child.type !== "element" || child.tagName !== "pre") return [];
        const block = toCodeBlock(child);
        if (!block) return [];
        const { value, lang, filename } = block.properties;
        return [
          {
            lang: String(lang),
            code: String(value),
            filename: typeof filename === "string" ? filename : undefined,
          },
        ];
      });
      node.properties.data = JSON.stringify(entries);
      // The component renders from `data`; the original blocks would only
      // be serialized a second time.
      node.children = [];
      return SKIP;
    }

    if (node.tagName === "pre" && parent && index !== undefined) {
      const block = toCodeBlock(node);
      if (block) {
        parent.children.splice(index, 1, block);
        return SKIP;
      }
    }
  });

  convertInlineCode(tree);
  await highlightElements(tree);
};

/** Rehype plugin for descriptions: highlighted inline code only. */
export const rehypeCodeInline = () => async (tree: Root) => {
  convertInlineCode(tree);
  await highlightElements(tree);
};

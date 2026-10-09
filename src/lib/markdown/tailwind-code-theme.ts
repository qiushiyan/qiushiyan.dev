/**
 * Custom Shiki/CodeHike theme based on the Tailwind CSS Light syntax palette.
 *
 * Uses CSS variables (var(--code-N)) so light/dark values are provided at
 * runtime via highlight.css.  The scope groupings are adapted from
 * github-light-default.json but re-mapped to match the Tailwind CSS colour
 * distinctions:
 *
 *   --code-1   comments
 *   --code-2   constants, booleans, numbers, enums, types, headings
 *   --code-3   entity names, variable definitions
 *   --code-4   default foreground (params, meta, variable.other)
 *   --code-5   function names
 *   --code-6   tags, components, JSON properties, quotes, inserted
 *   --code-7   keywords, storage, placeholders, embedded
 *   --code-8   strings, regexp, links, inline raw
 *   --code-9   invalid, errors, deleted
 *   --code-10  support, property-names, module-refs, string variables
 *   --code-11  bracket highlighting
 *
 *   --code-12 … --code-27  editor / UI chrome colours
 */

const tokenColors = [
  // ── comments ──────────────────────────────────────────────
  {
    scope: ["comment", "punctuation.definition.comment", "string.comment"],
    settings: { foreground: "var(--code-1)" },
  },

  // ── constant placeholders (template literals ${…}) ────────
  {
    scope: ["constant.other.placeholder", "constant.character"],
    settings: { foreground: "var(--code-7)" },
  },

  // ── constants, enums, types, headings ─────────────────────
  {
    scope: [
      "constant",
      "entity.name.constant",
      "variable.other.constant",
      "variable.other.enummember",
      "variable.language",
      "entity",
    ],
    settings: { foreground: "var(--code-2)" },
  },

  // ── entity names & variable definitions ───────────────────
  {
    scope: ["entity.name", "meta.export.default", "meta.definition.variable"],
    settings: { foreground: "var(--code-3)" },
  },

  // ── default foreground ────────────────────────────────────
  {
    scope: [
      "variable.parameter.function",
      "meta.jsx.children",
      "meta.block",
      "meta.tag.attributes",
      "entity.name.constant",
      "meta.object.member",
      "meta.embedded.expression",
    ],
    settings: { foreground: "var(--code-4)" },
  },

  // ── function names ────────────────────────────────────────
  {
    scope: "entity.name.function",
    settings: { foreground: "var(--code-5)" },
  },

  // ── tags & components ─────────────────────────────────────
  {
    scope: ["entity.name.tag", "support.class.component"],
    settings: { foreground: "var(--code-6)" },
  },

  // ── keywords ──────────────────────────────────────────────
  {
    scope: "keyword",
    settings: { foreground: "var(--code-7)" },
  },
  {
    scope: ["storage", "storage.type"],
    settings: { foreground: "var(--code-7)" },
  },
  {
    scope: [
      "storage.modifier.package",
      "storage.modifier.import",
      "storage.type.java",
    ],
    settings: { foreground: "var(--code-4)" },
  },

  // ── strings & regexp ──────────────────────────────────────
  {
    scope: ["string", "string punctuation.section.embedded source"],
    settings: { foreground: "var(--code-8)" },
  },

  // ── support / property-names  (split from constants) ──────
  {
    scope: "support",
    settings: { foreground: "var(--code-10)" },
  },
  {
    scope: "meta.property-name",
    settings: { foreground: "var(--code-10)" },
  },

  // ── variables ─────────────────────────────────────────────
  {
    scope: "variable",
    settings: { foreground: "var(--code-3)" },
  },
  {
    scope: "variable.other",
    settings: { foreground: "var(--code-4)" },
  },

  // ── invalid / errors ──────────────────────────────────────
  {
    scope: "invalid.broken",
    settings: { foreground: "var(--code-9)", fontStyle: "italic" },
  },
  {
    scope: "invalid.deprecated",
    settings: { foreground: "var(--code-9)", fontStyle: "italic" },
  },
  {
    scope: "invalid.illegal",
    settings: { foreground: "var(--code-9)", fontStyle: "italic" },
  },
  {
    scope: "invalid.unimplemented",
    settings: { foreground: "var(--code-9)", fontStyle: "italic" },
  },

  // ── carriage-return (rare) ────────────────────────────────
  {
    scope: "carriage-return",
    settings: {
      background: "var(--code-7)",
      foreground: "var(--code-12)",
      fontStyle: "italic underline",
    },
  },

  // ── error messages ────────────────────────────────────────
  { scope: "message.error", settings: { foreground: "var(--code-9)" } },

  // ── string variable interpolation ─────────────────────────
  { scope: "string variable", settings: { foreground: "var(--code-10)" } },

  // ── regexp ────────────────────────────────────────────────
  {
    scope: ["source.regexp", "string.regexp"],
    settings: { foreground: "var(--code-8)" },
  },
  {
    scope: [
      "string.regexp.character-class",
      "string.regexp constant.character.escape",
      "string.regexp source.ruby.embedded",
      "string.regexp string.regexp.arbitrary-repitition",
    ],
    settings: { foreground: "var(--code-8)" },
  },
  {
    scope: "string.regexp constant.character.escape",
    settings: { foreground: "var(--code-6)", fontStyle: "bold" },
  },

  // ── support (constants & variables) ───────────────────────
  {
    scope: "support.constant",
    settings: { foreground: "var(--code-10)" },
  },
  {
    scope: "support.variable",
    settings: { foreground: "var(--code-10)" },
  },

  // ── JSON property names ───────────────────────────────────
  {
    scope: "support.type.property-name.json",
    settings: { foreground: "var(--code-6)" },
  },

  // ── module references ─────────────────────────────────────
  {
    scope: "meta.module-reference",
    settings: { foreground: "var(--code-10)" },
  },

  // ── markdown list markers ─────────────────────────────────
  {
    scope: "punctuation.definition.list.begin.markdown",
    settings: { foreground: "var(--code-3)" },
  },

  // ── markup ────────────────────────────────────────────────
  {
    scope: ["markup.heading", "markup.heading entity.name"],
    settings: { foreground: "var(--code-2)", fontStyle: "bold" },
  },
  {
    scope: "markup.quote",
    settings: { foreground: "var(--code-6)" },
  },
  {
    scope: "markup.italic",
    settings: { foreground: "var(--code-4)", fontStyle: "italic" },
  },
  {
    scope: "markup.bold",
    settings: { foreground: "var(--code-4)", fontStyle: "bold" },
  },
  {
    scope: ["markup.underline"],
    settings: { fontStyle: "underline" },
  },
  {
    scope: ["markup.strikethrough"],
    settings: { fontStyle: "strikethrough" },
  },
  {
    scope: "markup.inline.raw",
    settings: { foreground: "var(--code-8)" },
  },

  // ── diffs ─────────────────────────────────────────────────
  {
    scope: [
      "markup.deleted",
      "meta.diff.header.from-file",
      "punctuation.definition.deleted",
    ],
    settings: { background: "var(--code-13)", foreground: "var(--code-9)" },
  },
  {
    scope: ["punctuation.section.embedded"],
    settings: { foreground: "var(--code-7)" },
  },
  {
    scope: [
      "markup.inserted",
      "meta.diff.header.to-file",
      "punctuation.definition.inserted",
    ],
    settings: { background: "var(--code-14)", foreground: "var(--code-6)" },
  },
  {
    scope: ["markup.changed", "punctuation.definition.changed"],
    settings: { background: "var(--code-15)", foreground: "var(--code-3)" },
  },
  {
    scope: ["markup.ignored", "markup.untracked"],
    settings: { background: "var(--code-2)", foreground: "var(--code-16)" },
  },
  {
    scope: "meta.diff.range",
    settings: { foreground: "var(--code-5)", fontStyle: "bold" },
  },
  {
    scope: "meta.diff.header",
    settings: { foreground: "var(--code-2)" },
  },
  {
    scope: "meta.separator",
    settings: { foreground: "var(--code-2)", fontStyle: "bold" },
  },
  {
    scope: "meta.output",
    settings: { foreground: "var(--code-2)" },
  },

  // ── bracket highlighting ──────────────────────────────────
  {
    scope: [
      "brackethighlighter.tag",
      "brackethighlighter.curly",
      "brackethighlighter.round",
      "brackethighlighter.square",
      "brackethighlighter.angle",
      "brackethighlighter.quote",
    ],
    settings: { foreground: "var(--code-11)" },
  },
  {
    scope: "brackethighlighter.unmatched",
    settings: { foreground: "var(--code-9)" },
  },

  // ── links ─────────────────────────────────────────────────
  {
    scope: ["constant.other.reference.link", "string.other.link"],
    settings: { foreground: "var(--code-8)", fontStyle: "underline" },
  },
];

const colors = {
  "editor.background": "var(--code-17)",
  "editor.foreground": "var(--code-4)",
  "editor.lineHighlightBackground": "var(--code-18)",
  "editor.rangeHighlightBackground": "var(--code-19)",
  "editor.infoForeground": "var(--code-20)",
  "editor.selectionBackground": "var(--code-21)",
  focusBorder: "var(--code-22)",
  "tab.activeBackground": "var(--code-17)",
  "tab.activeForeground": "var(--code-4)",
  "tab.inactiveBackground": "var(--code-23)",
  "tab.inactiveForeground": "var(--code-11)",
  "tab.border": "var(--code-24)",
  "tab.activeBorder": "var(--code-17)",
  "editorGroup.border": "var(--code-24)",
  "editorGroupHeader.tabsBackground": "var(--code-23)",
  "editorLineNumber.foreground": "var(--code-25)",
  "input.background": "var(--code-17)",
  "input.foreground": "var(--code-4)",
  "input.border": "var(--code-24)",
  "icon.foreground": "var(--code-11)",
  "sideBar.background": "var(--code-23)",
  "sideBar.foreground": "var(--code-4)",
  "sideBar.border": "var(--code-24)",
  "list.activeSelectionBackground": "var(--code-26)",
  "list.activeSelectionForeground": "var(--code-4)",
  "list.hoverBackground": "var(--code-18)",
  "list.hoverForeground": "var(--code-4)",
  foreground: "var(--code-4)",
  background: "var(--code-17)",
  "lighter.inlineBackground": "var(--code-27)",
};

export const tailwindCodeTheme = {
  name: "tailwind-from-css",
  type: "from-css",
  tokenColors,
  colors,
};

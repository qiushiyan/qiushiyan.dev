export const myTheme = {
  name: "Houston",
  type: "dark",
  semanticHighlighting: true,
  semanticTokenColors: {
    enumMember: {
      foreground: "#eef0f9",
    },
    "variable.constant": {
      foreground: "#ffd493",
    },
    "variable.defaultLibrary": {
      foreground: "#acafff",
    },
  },
  tokenColors: [
    {
      name: "unison punctuation",
      scope:
        "punctuation.definition.delayed.unison,punctuation.definition.list.begin.unison,punctuation.definition.list.end.unison,punctuation.definition.ability.begin.unison,punctuation.definition.ability.end.unison,punctuation.operator.assignment.as.unison,punctuation.separator.pipe.unison,punctuation.separator.delimiter.unison,punctuation.definition.hash.unison",
      settings: {
        foreground: "#4bf3c8",
      },
    },
    {
      name: "haskell variable generic-type",
      scope: "variable.other.generic-type.haskell",
      settings: {
        foreground: "#54b9ff",
      },
    },
    {
      name: "haskell storage type",
      scope: "storage.type.haskell",
      settings: {
        foreground: "#ffd493",
      },
    },
    {
      name: "support.variable.magic.python",
      scope: "support.variable.magic.python",
      settings: {
        foreground: "#4bf3c8",
      },
    },
    {
      name: "punctuation.separator.parameters.python",
      scope:
        "punctuation.separator.period.python,punctuation.separator.element.python,punctuation.parenthesis.begin.python,punctuation.parenthesis.end.python",
      settings: {
        foreground: "#eef0f9",
      },
    },
    {
      name: "variable.parameter.function.language.special.self.python",
      scope: "variable.parameter.function.language.special.self.python",
      settings: {
        foreground: "#acafff",
      },
    },
    {
      name: "storage.modifier.lifetime.rust",
      scope: "storage.modifier.lifetime.rust",
      settings: {
        foreground: "#eef0f9",
      },
    },
    {
      name: "support.function.std.rust",
      scope: "support.function.std.rust",
      settings: {
        foreground: "#00daef",
      },
    },
    {
      name: "entity.name.lifetime.rust",
      scope: "entity.name.lifetime.rust",
      settings: {
        foreground: "#acafff",
      },
    },
    {
      name: "variable.language.rust",
      scope: "variable.language.rust",
      settings: {
        foreground: "#4bf3c8",
      },
    },
    {
      name: "support.constant.edge",
      scope: "support.constant.edge",
      settings: {
        foreground: "#54b9ff",
      },
    },
    {
      name: "regexp constant character-class",
      scope: "constant.other.character-class.regexp",
      settings: {
        foreground: "#4bf3c8",
      },
    },
    {
      name: "regexp operator.quantifier",
      scope: "keyword.operator.quantifier.regexp",
      settings: {
        foreground: "#ffd493",
      },
    },
    {
      name: "punctuation.definition",
      scope:
        "punctuation.definition.string.begin,punctuation.definition.string.end",
      settings: {
        foreground: "#ffd493",
      },
    },
    {
      name: "Text",
      scope: "variable.parameter.function",
      settings: {
        foreground: "#eef0f9",
      },
    },
    {
      name: "Comment Markup Link",
      scope: "comment markup.link",
      settings: {
        foreground: "#545864",
      },
    },
    {
      name: "markup diff",
      scope: "markup.changed.diff",
      settings: {
        foreground: "#acafff",
      },
    },
    {
      name: "diff",
      scope:
        "meta.diff.header.from-file,meta.diff.header.to-file,punctuation.definition.from-file.diff,punctuation.definition.to-file.diff",
      settings: {
        foreground: "#00daef",
      },
    },
    {
      name: "inserted.diff",
      scope: "markup.inserted.diff",
      settings: {
        foreground: "#ffd493",
      },
    },
    {
      name: "deleted.diff",
      scope: "markup.deleted.diff",
      settings: {
        foreground: "#4bf3c8",
      },
    },
    {
      name: "c++ function",
      scope: "meta.function.c,meta.function.cpp",
      settings: {
        foreground: "#4bf3c8",
      },
    },
    {
      name: "c++ block",
      scope:
        "punctuation.section.block.begin.bracket.curly.cpp,punctuation.section.block.end.bracket.curly.cpp,punctuation.terminator.statement.c,punctuation.section.block.begin.bracket.curly.c,punctuation.section.block.end.bracket.curly.c,punctuation.section.parens.begin.bracket.round.c,punctuation.section.parens.end.bracket.round.c,punctuation.section.parameters.begin.bracket.round.c,punctuation.section.parameters.end.bracket.round.c",
      settings: {
        foreground: "#eef0f9",
      },
    },
    {
      name: "js/ts punctuation separator key-value",
      scope: "punctuation.separator.key-value",
      settings: {
        foreground: "#eef0f9",
      },
    },
    {
      name: "js/ts import keyword",
      scope: "keyword.operator.expression.import",
      settings: {
        foreground: "#00daef",
      },
    },
    {
      name: "math js/ts",
      scope: "support.constant.math",
      settings: {
        foreground: "#acafff",
      },
    },
    {
      name: "math property js/ts",
      scope: "support.constant.property.math",
      settings: {
        foreground: "#ffd493",
      },
    },
    {
      name: "js/ts variable.other.constant",
      scope: "variable.other.constant",
      settings: {
        foreground: "#acafff",
      },
    },
    {
      name: "java type",
      scope: ["storage.type.annotation.java", "storage.type.object.array.java"],
      settings: {
        foreground: "#acafff",
      },
    },
    {
      name: "java source",
      scope: "source.java",
      settings: {
        foreground: "#4bf3c8",
      },
    },
    {
      name: "java modifier.import",
      scope:
        "punctuation.section.block.begin.java,punctuation.section.block.end.java,punctuation.definition.method-parameters.begin.java,punctuation.definition.method-parameters.end.java,meta.method.identifier.java,punctuation.section.method.begin.java,punctuation.section.method.end.java,punctuation.terminator.java,punctuation.section.class.begin.java,punctuation.section.class.end.java,punctuation.section.inner-class.begin.java,punctuation.section.inner-class.end.java,meta.method-call.java,punctuation.section.class.begin.bracket.curly.java,punctuation.section.class.end.bracket.curly.java,punctuation.section.method.begin.bracket.curly.java,punctuation.section.method.end.bracket.curly.java,punctuation.separator.period.java,punctuation.bracket.angle.java,punctuation.definition.annotation.java,meta.method.body.java",
      settings: {
        foreground: "#eef0f9",
      },
    },
    {
      name: "java modifier.import",
      scope: "meta.method.java",
      settings: {
        foreground: "#00daef",
      },
    },
    {
      name: "java modifier.import",
      scope:
        "storage.modifier.import.java,storage.type.java,storage.type.generic.java",
      settings: {
        foreground: "#acafff",
      },
    },
    {
      name: "java instanceof",
      scope: "keyword.operator.instanceof.java",
      settings: {
        foreground: "#54b9ff",
      },
    },
    {
      name: "java variable.name",
      scope: "meta.definition.variable.name.java",
      settings: {
        foreground: "#4bf3c8",
      },
    },
    {
      name: "operator logical",
      scope: "keyword.operator.logical",
      settings: {
        foreground: "#eef0f9",
      },
    },
    {
      name: "operator bitwise",
      scope: "keyword.operator.bitwise",
      settings: {
        foreground: "#eef0f9",
      },
    },
    {
      name: "operator channel",
      scope: "keyword.operator.channel",
      settings: {
        foreground: "#eef0f9",
      },
    },
    {
      name: "support.constant.property-value.scss",
      scope:
        "support.constant.property-value.scss,support.constant.property-value.css",
      settings: {
        foreground: "#ffd493",
      },
    },
    {
      name: "CSS/SCSS/LESS Operators",
      scope: "keyword.operator.css,keyword.operator.scss,keyword.operator.less",
      settings: {
        foreground: "#eef0f9",
      },
    },
    {
      name: "css color standard name",
      scope:
        "support.constant.color.w3c-standard-color-name.css,support.constant.color.w3c-standard-color-name.scss",
      settings: {
        foreground: "#ffd493",
      },
    },
    {
      name: "css comma",
      scope: "punctuation.separator.list.comma.css",
      settings: {
        foreground: "#eef0f9",
      },
    },
    {
      name: "css attribute-name.id",
      scope: "support.constant.color.w3c-standard-color-name.css",
      settings: {
        foreground: "#ffd493",
      },
    },
    {
      name: "css property-name",
      scope: "support.type.vendored.property-name.css",
      settings: {
        foreground: "#eef0f9",
      },
    },
    {
      name: "js/ts module",
      scope:
        "support.module.node,support.type.object.module,support.module.node",
      settings: {
        foreground: "#acafff",
      },
    },
    {
      name: "entity.name.type.module",
      scope: "entity.name.type.module",
      settings: {
        foreground: "#ffd493",
      },
    },
    {
      name: "js variable readwrite",
      scope:
        "variable.other.readwrite,meta.object-literal.key,support.variable.property,support.variable.object.process,support.variable.object.node",
      settings: {
        foreground: "#4bf3c8",
      },
    },
    {
      name: "js/ts json",
      scope: "support.constant.json",
      settings: {
        foreground: "#ffd493",
      },
    },
    {
      name: "js/ts Keyword",
      scope: [
        "keyword.operator.expression.instanceof",
        "keyword.operator.new",
        "keyword.operator.ternary",
        "keyword.operator.optional",
        "keyword.operator.expression.keyof",
      ],
      settings: {
        foreground: "#54b9ff",
      },
    },
    {
      name: "js/ts console",
      scope: "support.type.object.console",
      settings: {
        foreground: "#4bf3c8",
      },
    },
    {
      name: "js/ts support.variable.property.process",
      scope: "support.variable.property.process",
      settings: {
        foreground: "#ffd493",
      },
    },
    {
      name: "js console function",
      scope: "entity.name.function,support.function.console",
      settings: {
        foreground: "#00daef",
      },
    },
    {
      name: "keyword.operator.misc.rust",
      scope: "keyword.operator.misc.rust",
      settings: {
        foreground: "#eef0f9",
      },
    },
    {
      name: "keyword.operator.sigil.rust",
      scope: "keyword.operator.sigil.rust",
      settings: {
        foreground: "#54b9ff",
      },
    },
    {
      name: "operator",
      scope: "keyword.operator.delete",
      settings: {
        foreground: "#54b9ff",
      },
    },
    {
      name: "js dom",
      scope: "support.type.object.dom",
      settings: {
        foreground: "#eef0f9",
      },
    },
    {
      name: "js dom variable",
      scope: "support.variable.dom,support.variable.property.dom",
      settings: {
        foreground: "#4bf3c8",
      },
    },
    {
      name: "keyword.operator",
      scope:
        "keyword.operator.arithmetic,keyword.operator.comparison,keyword.operator.decrement,keyword.operator.increment,keyword.operator.relational",
      settings: {
        foreground: "#eef0f9",
      },
    },
    {
      name: "C operator assignment",
      scope:
        "keyword.operator.assignment.c,keyword.operator.comparison.c,keyword.operator.c,keyword.operator.increment.c,keyword.operator.decrement.c,keyword.operator.bitwise.shift.c,keyword.operator.assignment.cpp,keyword.operator.comparison.cpp,keyword.operator.cpp,keyword.operator.increment.cpp,keyword.operator.decrement.cpp,keyword.operator.bitwise.shift.cpp",
      settings: {
        foreground: "#54b9ff",
      },
    },
    {
      name: "Punctuation",
      scope: "punctuation.separator.delimiter",
      settings: {
        foreground: "#eef0f9",
      },
    },
    {
      name: "Other punctuation .c",
      scope: "punctuation.separator.c,punctuation.separator.cpp",
      settings: {
        foreground: "#54b9ff",
      },
    },
    {
      name: "C type posix-reserved",
      scope: "support.type.posix-reserved.c,support.type.posix-reserved.cpp",
      settings: {
        foreground: "#eef0f9",
      },
    },
    {
      name: "keyword.operator.sizeof.c",
      scope: "keyword.operator.sizeof.c,keyword.operator.sizeof.cpp",
      settings: {
        foreground: "#54b9ff",
      },
    },
    {
      name: "python parameter",
      scope: "variable.parameter.function.language.python",
      settings: {
        foreground: "#ffd493",
      },
    },
    {
      name: "python type",
      scope: "support.type.python",
      settings: {
        foreground: "#eef0f9",
      },
    },
    {
      name: "python logical",
      scope: "keyword.operator.logical.python",
      settings: {
        foreground: "#54b9ff",
      },
    },
    {
      name: "pyCs",
      scope: "variable.parameter.function.python",
      settings: {
        foreground: "#ffd493",
      },
    },
    {
      name: "python block",
      scope:
        "punctuation.definition.arguments.begin.python,punctuation.definition.arguments.end.python,punctuation.separator.arguments.python,punctuation.definition.list.begin.python,punctuation.definition.list.end.python",
      settings: {
        foreground: "#eef0f9",
      },
    },
    {
      name: "python function-call.generic",
      scope: "meta.function-call.generic.python",
      settings: {
        foreground: "#00daef",
      },
    },
    {
      name: "python placeholder reset to normal string",
      scope: "constant.character.format.placeholder.other.python",
      settings: {
        foreground: "#ffd493",
      },
    },
    {
      name: "Operators",
      scope: "keyword.operator",
      settings: {
        foreground: "#eef0f9",
      },
    },
    {
      name: "Compound Assignment Operators",
      scope: "keyword.operator.assignment.compound",
      settings: {
        foreground: "#54b9ff",
      },
    },
    {
      name: "Compound Assignment Operators js/ts",
      scope:
        "keyword.operator.assignment.compound.js,keyword.operator.assignment.compound.ts",
      settings: {
        foreground: "#eef0f9",
      },
    },
    {
      name: "Keywords",
      scope: "keyword",
      settings: {
        foreground: "#54b9ff",
      },
    },
    {
      name: "Namespaces",
      scope: "entity.name.namespace",
      settings: {
        foreground: "#acafff",
      },
    },
    {
      name: "Variables",
      scope: "variable",
      settings: {
        foreground: "#4bf3c8",
      },
    },
    {
      name: "Variables",
      scope: "variable.c",
      settings: {
        foreground: "#eef0f9",
      },
    },
    {
      name: "Language variables",
      scope: "variable.language",
      settings: {
        foreground: "#acafff",
      },
    },
    {
      name: "Java Variables",
      scope: "token.variable.parameter.java",
      settings: {
        foreground: "#eef0f9",
      },
    },
    {
      name: "Java Imports",
      scope: "import.storage.java",
      settings: {
        foreground: "#acafff",
      },
    },
    {
      name: "Packages",
      scope: "token.package.keyword",
      settings: {
        foreground: "#54b9ff",
      },
    },
    {
      name: "Packages",
      scope: "token.package",
      settings: {
        foreground: "#eef0f9",
      },
    },
    {
      name: "Functions",
      scope: [
        "entity.name.function",
        "meta.require",
        "support.function.any-method",
        "variable.function",
      ],
      settings: {
        foreground: "#00daef",
      },
    },
    {
      name: "Classes",
      scope: "entity.name.type.namespace",
      settings: {
        foreground: "#acafff",
      },
    },
    {
      name: "Classes",
      scope: "support.class, entity.name.type.class",
      settings: {
        foreground: "#acafff",
      },
    },
    {
      name: "Class name",
      scope: "entity.name.class.identifier.namespace.type",
      settings: {
        foreground: "#acafff",
      },
    },
    {
      name: "Class name",
      scope: [
        "entity.name.class",
        "variable.other.class.js",
        "variable.other.class.ts",
      ],
      settings: {
        foreground: "#acafff",
      },
    },
    {
      name: "Class name php",
      scope: "variable.other.class.php",
      settings: {
        foreground: "#4bf3c8",
      },
    },
    {
      name: "Type Name",
      scope: "entity.name.type",
      settings: {
        foreground: "#acafff",
      },
    },
    {
      name: "Keyword Control",
      scope: "keyword.control",
      settings: {
        foreground: "#54b9ff",
      },
    },
    {
      name: "Control Elements",
      scope: "control.elements, keyword.operator.less",
      settings: {
        foreground: "#ffd493",
      },
    },
    {
      name: "Methods",
      scope: "keyword.other.special-method",
      settings: {
        foreground: "#00daef",
      },
    },
    {
      name: "Storage",
      scope: "storage",
      settings: {
        foreground: "#54b9ff",
      },
    },
    {
      name: "Storage JS TS",
      scope: "token.storage",
      settings: {
        foreground: "#54b9ff",
      },
    },
    {
      name: "Source Js Keyword Operator Delete,source Js Keyword Operator In,source Js Keyword Operator Of,source Js Keyword Operator Instanceof,source Js Keyword Operator New,source Js Keyword Operator Typeof,source Js Keyword Operator Void",
      scope:
        "keyword.operator.expression.delete,keyword.operator.expression.in,keyword.operator.expression.of,keyword.operator.expression.instanceof,keyword.operator.new,keyword.operator.expression.typeof,keyword.operator.expression.void",
      settings: {
        foreground: "#54b9ff",
      },
    },
    {
      name: "Java Storage",
      scope: "token.storage.type.java",
      settings: {
        foreground: "#acafff",
      },
    },
    {
      name: "Support",
      scope: "support.function",
      settings: {
        foreground: "#eef0f9",
      },
    },
    {
      name: "Support type",
      scope: "support.type.property-name",
      settings: {
        foreground: "#eef0f9",
      },
    },
    {
      name: "Support type",
      scope: "support.constant.property-value",
      settings: {
        foreground: "#eef0f9",
      },
    },
    {
      name: "Support type",
      scope: "support.constant.font-name",
      settings: {
        foreground: "#ffd493",
      },
    },
    {
      name: "Meta tag",
      scope: "meta.tag",
      settings: {
        foreground: "#eef0f9",
      },
    },
    {
      name: "Strings",
      scope: "string",
      settings: {
        foreground: "#ffd493",
      },
    },
    {
      name: "Inherited Class",
      scope: "entity.other.inherited-class",
      settings: {
        foreground: "#acafff",
      },
    },
    {
      name: "Constant other symbol",
      scope: "constant.other.symbol",
      settings: {
        foreground: "#eef0f9",
      },
    },
    {
      name: "Integers",
      scope: "constant.numeric",
      settings: {
        foreground: "#ffd493",
      },
    },
    {
      name: "Constants",
      scope: "constant",
      settings: {
        foreground: "#ffd493",
      },
    },
    {
      name: "Constants",
      scope: "punctuation.definition.constant",
      settings: {
        foreground: "#ffd493",
      },
    },
    {
      name: "Tags",
      scope: "entity.name.tag",
      settings: {
        foreground: "#54b9ff",
      },
    },
    {
      name: "Attributes",
      scope: "entity.other.attribute-name",
      settings: {
        foreground: "#4bf3c8",
      },
    },
    {
      name: "HTML Attributes",
      scope: "entity.other.attribute-name.html",
      settings: {
        foreground: "#acafff",
      },
    },
    {
      name: "Astro directives",
      scope: "source.astro.meta.attribute.client:idle.html",
      settings: {
        foreground: "#ffd493",
        fontStyle: "italic",
      },
    },
    {
      name: "HTML Strings",
      scope:
        "string.quoted.double.html,string.quoted.single.html,string.template.html,punctuation.definition.string.begin.html,punctuation.definition.string.end.html",
      settings: {
        foreground: "#4bf3c8",
      },
    },
    {
      name: "Attribute IDs",
      scope: "entity.other.attribute-name.id",
      settings: {
        fontStyle: "normal",
        foreground: "#00daef",
      },
    },
    {
      name: "Attribute class",
      scope: "entity.other.attribute-name.class.css",
      settings: {
        fontStyle: "normal",
        foreground: "#4bf3c8",
      },
    },
    {
      name: "Selector",
      scope: "meta.selector",
      settings: {
        foreground: "#54b9ff",
      },
    },
    {
      name: "Headings",
      scope: "markup.heading",
      settings: {
        foreground: "#4bf3c8",
      },
    },
    {
      name: "Headings",
      scope:
        "markup.heading punctuation.definition.heading, entity.name.section",
      settings: {
        foreground: "#00daef",
      },
    },
    {
      name: "Units",
      scope: "keyword.other.unit",
      settings: {
        foreground: "#4bf3c8",
      },
    },
    {
      name: "Bold",
      scope: "markup.bold,todo.bold",
      settings: {
        foreground: "#ffd493",
      },
    },
    {
      name: "Bold",
      scope: "punctuation.definition.bold",
      settings: {
        foreground: "#acafff",
      },
    },
    {
      name: "markup Italic",
      scope: "markup.italic, punctuation.definition.italic,todo.emphasis",
      settings: {
        foreground: "#54b9ff",
      },
    },
    {
      name: "emphasis md",
      scope: "emphasis md",
      settings: {
        foreground: "#54b9ff",
      },
    },
    {
      name: "[VSCODE-CUSTOM] Markdown headings",
      scope: "entity.name.section.markdown",
      settings: {
        foreground: "#4bf3c8",
      },
    },
    {
      name: "[VSCODE-CUSTOM] Markdown heading Punctuation Definition",
      scope: "punctuation.definition.heading.markdown",
      settings: {
        foreground: "#4bf3c8",
      },
    },
    {
      name: "punctuation.definition.list.begin.markdown",
      scope: "punctuation.definition.list.begin.markdown",
      settings: {
        foreground: "#4bf3c8",
      },
    },
    {
      name: "[VSCODE-CUSTOM] Markdown heading setext",
      scope: "markup.heading.setext",
      settings: {
        foreground: "#eef0f9",
      },
    },
    {
      name: "[VSCODE-CUSTOM] Markdown Punctuation Definition Bold",
      scope: "punctuation.definition.bold.markdown",
      settings: {
        foreground: "#ffd493",
      },
    },
    {
      name: "[VSCODE-CUSTOM] Markdown Inline Raw",
      scope: "markup.inline.raw.markdown",
      settings: {
        foreground: "#ffd493",
      },
    },
    {
      name: "[VSCODE-CUSTOM] Markdown Inline Raw",
      scope: "markup.inline.raw.string.markdown",
      settings: {
        foreground: "#ffd493",
      },
    },
    {
      name: "[VSCODE-CUSTOM] Markdown List Punctuation Definition",
      scope: "punctuation.definition.list.markdown",
      settings: {
        foreground: "#4bf3c8",
      },
    },
    {
      name: "[VSCODE-CUSTOM] Markdown Punctuation Definition String",
      scope: [
        "punctuation.definition.string.begin.markdown",
        "punctuation.definition.string.end.markdown",
        "punctuation.definition.metadata.markdown",
      ],
      settings: {
        foreground: "#4bf3c8",
      },
    },
    {
      name: "beginning.punctuation.definition.list.markdown",
      scope: ["beginning.punctuation.definition.list.markdown"],
      settings: {
        foreground: "#4bf3c8",
      },
    },
    {
      name: "[VSCODE-CUSTOM] Markdown Punctuation Definition Link",
      scope: "punctuation.definition.metadata.markdown",
      settings: {
        foreground: "#4bf3c8",
      },
    },
    {
      name: "[VSCODE-CUSTOM] Markdown Underline Link/Image",
      scope:
        "markup.underline.link.markdown,markup.underline.link.image.markdown",
      settings: {
        foreground: "#54b9ff",
      },
    },
    {
      name: "[VSCODE-CUSTOM] Markdown Link Title/Description",
      scope:
        "string.other.link.title.markdown,string.other.link.description.markdown",
      settings: {
        foreground: "#00daef",
      },
    },
    {
      name: "Regular Expressions",
      scope: "string.regexp",
      settings: {
        foreground: "#eef0f9",
      },
    },
    {
      name: "Escape Characters",
      scope: "constant.character.escape",
      settings: {
        foreground: "#eef0f9",
      },
    },
    {
      name: "Embedded",
      scope: "punctuation.section.embedded, variable.interpolation",
      settings: {
        foreground: "#4bf3c8",
      },
    },
    {
      name: "Embedded",
      scope:
        "punctuation.section.embedded.begin,punctuation.section.embedded.end",
      settings: {
        foreground: "#54b9ff",
      },
    },
    {
      name: "illegal",
      scope: "invalid.illegal",
      settings: {
        foreground: "#ffffff",
      },
    },
    {
      name: "illegal",
      scope: "invalid.illegal.bad-ampersand.html",
      settings: {
        foreground: "#eef0f9",
      },
    },
    {
      name: "Broken",
      scope: "invalid.broken",
      settings: {
        foreground: "#ffffff",
      },
    },
    {
      name: "Deprecated",
      scope: "invalid.deprecated",
      settings: {
        foreground: "#ffffff",
      },
    },
    {
      name: "Unimplemented",
      scope: "invalid.unimplemented",
      settings: {
        foreground: "#ffffff",
      },
    },
    {
      name: "Source Json Meta Structure Dictionary Json > String Quoted Json",
      scope: "source.json meta.structure.dictionary.json > string.quoted.json",
      settings: {
        foreground: "#cc75f4",
      },
    },
    {
      name: "Source Json Meta Structure Dictionary Json > String Quoted Json > Punctuation String",
      scope:
        "source.json meta.structure.dictionary.json > string.quoted.json > punctuation.string",
      settings: {
        foreground: "#4bf3c8",
      },
    },
    {
      name: "Source Json Meta Structure Dictionary Json > Value Json > String Quoted Json,source Json Meta Structure Array Json > Value Json > String Quoted Json,source Json Meta Structure Dictionary Json > Value Json > String Quoted Json > Punctuation,source Json Meta Structure Array Json > Value Json > String Quoted Json > Punctuation",
      scope:
        "source.json meta.structure.dictionary.json > value.json > string.quoted.json,source.json meta.structure.array.json > value.json > string.quoted.json,source.json meta.structure.dictionary.json > value.json > string.quoted.json > punctuation,source.json meta.structure.array.json > value.json > string.quoted.json > punctuation",
      settings: {
        foreground: "#ffd493",
      },
    },
    {
      name: "Source Json Meta Structure Dictionary Json > Constant Language Json,source Json Meta Structure Array Json > Constant Language Json",
      scope:
        "source.json meta.structure.dictionary.json > constant.language.json,source.json meta.structure.array.json > constant.language.json",
      settings: {
        foreground: "#eef0f9",
      },
    },
    {
      name: "[VSCODE-CUSTOM] JSON Property Name",
      scope: "support.type.property-name.json",
      settings: {
        foreground: "#4bf3c8",
      },
    },
    {
      name: "[VSCODE-CUSTOM] JSON Punctuation for Property Name",
      scope: "support.type.property-name.json punctuation",
      settings: {
        foreground: "#4bf3c8",
      },
    },
    {
      name: "laravel blade tag",
      scope:
        "text.html.laravel-blade source.php.embedded.line.html entity.name.tag.laravel-blade",
      settings: {
        foreground: "#54b9ff",
      },
    },
    {
      name: "laravel blade @",
      scope:
        "text.html.laravel-blade source.php.embedded.line.html support.constant.laravel-blade",
      settings: {
        foreground: "#54b9ff",
      },
    },
    {
      name: "use statement for other classes",
      scope:
        "support.other.namespace.use.php,support.other.namespace.use-as.php,support.other.namespace.php,entity.other.alias.php,meta.interface.php",
      settings: {
        foreground: "#acafff",
      },
    },
    {
      name: "error suppression",
      scope: "keyword.operator.error-control.php",
      settings: {
        foreground: "#54b9ff",
      },
    },
    {
      name: "php instanceof",
      scope: "keyword.operator.type.php",
      settings: {
        foreground: "#54b9ff",
      },
    },
    {
      name: "style double quoted array index normal begin",
      scope: "punctuation.section.array.begin.php",
      settings: {
        foreground: "#eef0f9",
      },
    },
    {
      name: "style double quoted array index normal end",
      scope: "punctuation.section.array.end.php",
      settings: {
        foreground: "#eef0f9",
      },
    },
    {
      name: "php illegal.non-null-typehinted",
      scope: "invalid.illegal.non-null-typehinted.php",
      settings: {
        foreground: "#f44747",
      },
    },
    {
      name: "php types",
      scope:
        "storage.type.php,meta.other.type.phpdoc.php,keyword.other.type.php,keyword.other.array.phpdoc.php",
      settings: {
        foreground: "#acafff",
      },
    },
    {
      name: "php call-function",
      scope:
        "meta.function-call.php,meta.function-call.object.php,meta.function-call.static.php",
      settings: {
        foreground: "#00daef",
      },
    },
    {
      name: "php function-resets",
      scope:
        "punctuation.definition.parameters.begin.bracket.round.php,punctuation.definition.parameters.end.bracket.round.php,punctuation.separator.delimiter.php,punctuation.section.scope.begin.php,punctuation.section.scope.end.php,punctuation.terminator.expression.php,punctuation.definition.arguments.begin.bracket.round.php,punctuation.definition.arguments.end.bracket.round.php,punctuation.definition.storage-type.begin.bracket.round.php,punctuation.definition.storage-type.end.bracket.round.php,punctuation.definition.array.begin.bracket.round.php,punctuation.definition.array.end.bracket.round.php,punctuation.definition.begin.bracket.round.php,punctuation.definition.end.bracket.round.php,punctuation.definition.begin.bracket.curly.php,punctuation.definition.end.bracket.curly.php,punctuation.definition.section.switch-block.end.bracket.curly.php,punctuation.definition.section.switch-block.start.bracket.curly.php,punctuation.definition.section.switch-block.begin.bracket.curly.php,punctuation.definition.section.switch-block.end.bracket.curly.php",
      settings: {
        foreground: "#eef0f9",
      },
    },
    {
      name: "support php constants",
      scope: "support.constant.core.rust",
      settings: {
        foreground: "#ffd493",
      },
    },
    {
      name: "support php constants",
      scope:
        "support.constant.ext.php,support.constant.std.php,support.constant.core.php,support.constant.parser-token.php",
      settings: {
        foreground: "#ffd493",
      },
    },
    {
      name: "php goto",
      scope: "entity.name.goto-label.php,support.other.php",
      settings: {
        foreground: "#00daef",
      },
    },
    {
      name: "php logical/bitwise operator",
      scope:
        "keyword.operator.logical.php,keyword.operator.bitwise.php,keyword.operator.arithmetic.php",
      settings: {
        foreground: "#eef0f9",
      },
    },
    {
      name: "php regexp operator",
      scope: "keyword.operator.regexp.php",
      settings: {
        foreground: "#54b9ff",
      },
    },
    {
      name: "php comparison",
      scope: "keyword.operator.comparison.php",
      settings: {
        foreground: "#eef0f9",
      },
    },
    {
      name: "php heredoc/nowdoc",
      scope: "keyword.operator.heredoc.php,keyword.operator.nowdoc.php",
      settings: {
        foreground: "#54b9ff",
      },
    },
    {
      name: "python function decorator @",
      scope: "meta.function.decorator.python",
      settings: {
        foreground: "#00daef",
      },
    },
    {
      name: "python function support",
      scope:
        "support.token.decorator.python,meta.function.decorator.identifier.python",
      settings: {
        foreground: "#eef0f9",
      },
    },
    {
      name: "parameter function js/ts",
      scope: "function.parameter",
      settings: {
        foreground: "#eef0f9",
      },
    },
    {
      name: "brace function",
      scope: "function.brace",
      settings: {
        foreground: "#eef0f9",
      },
    },
    {
      name: "parameter function ruby cs",
      scope: "function.parameter.ruby, function.parameter.cs",
      settings: {
        foreground: "#eef0f9",
      },
    },
    {
      name: "constant.language.symbol.ruby",
      scope: "constant.language.symbol.ruby",
      settings: {
        foreground: "#eef0f9",
      },
    },
    {
      name: "rgb-value",
      scope: "rgb-value",
      settings: {
        foreground: "#eef0f9",
      },
    },
    {
      name: "rgb value",
      scope: "inline-color-decoration rgb-value",
      settings: {
        foreground: "#ffd493",
      },
    },
    {
      name: "rgb value less",
      scope: "less rgb-value",
      settings: {
        foreground: "#ffd493",
      },
    },
    {
      name: "sass selector",
      scope: "selector.sass",
      settings: {
        foreground: "#4bf3c8",
      },
    },
    {
      name: "ts primitive/builtin types",
      scope:
        "support.type.primitive.ts,support.type.builtin.ts,support.type.primitive.tsx,support.type.builtin.tsx",
      settings: {
        foreground: "#acafff",
      },
    },
    {
      name: "block scope",
      scope: "block.scope.end,block.scope.begin",
      settings: {
        foreground: "#eef0f9",
      },
    },
    {
      name: "cs storage type",
      scope: "storage.type.cs",
      settings: {
        foreground: "#acafff",
      },
    },
    {
      name: "cs local variable",
      scope: "entity.name.variable.local.cs",
      settings: {
        foreground: "#4bf3c8",
      },
    },
    {
      scope: "token.info-token",
      settings: {
        foreground: "#00daef",
      },
    },
    {
      scope: "token.warn-token",
      settings: {
        foreground: "#ffd493",
      },
    },
    {
      scope: "token.error-token",
      settings: {
        foreground: "#f44747",
      },
    },
    {
      scope: "token.debug-token",
      settings: {
        foreground: "#54b9ff",
      },
    },
    {
      name: "String interpolation",
      scope: [
        "punctuation.definition.template-expression.begin",
        "punctuation.definition.template-expression.end",
        "punctuation.section.embedded",
      ],
      settings: {
        foreground: "#54b9ff",
      },
    },
    {
      name: "Reset JavaScript string interpolation expression",
      scope: ["meta.template.expression"],
      settings: {
        foreground: "#eef0f9",
      },
    },
    {
      name: "Import module JS",
      scope: ["keyword.operator.module"],
      settings: {
        foreground: "#54b9ff",
      },
    },
    {
      name: "js Flowtype",
      scope: ["support.type.type.flowtype"],
      settings: {
        foreground: "#00daef",
      },
    },
    {
      name: "js Flow",
      scope: ["support.type.primitive"],
      settings: {
        foreground: "#acafff",
      },
    },
    {
      name: "js class prop",
      scope: ["meta.property.object"],
      settings: {
        foreground: "#4bf3c8",
      },
    },
    {
      name: "js func parameter",
      scope: ["variable.parameter.function.js"],
      settings: {
        foreground: "#4bf3c8",
      },
    },
    {
      name: "js template literals begin",
      scope: ["keyword.other.template.begin"],
      settings: {
        foreground: "#ffd493",
      },
    },
    {
      name: "js template literals end",
      scope: ["keyword.other.template.end"],
      settings: {
        foreground: "#ffd493",
      },
    },
    {
      name: "js template literals variable braces begin",
      scope: ["keyword.other.substitution.begin"],
      settings: {
        foreground: "#ffd493",
      },
    },
    {
      name: "js template literals variable braces end",
      scope: ["keyword.other.substitution.end"],
      settings: {
        foreground: "#ffd493",
      },
    },
    {
      name: "js operator.assignment",
      scope: ["keyword.operator.assignment"],
      settings: {
        foreground: "#eef0f9",
      },
    },
    {
      name: "go operator",
      scope: ["keyword.operator.assignment.go"],
      settings: {
        foreground: "#acafff",
      },
    },
    {
      name: "go operator",
      scope: ["keyword.operator.arithmetic.go", "keyword.operator.address.go"],
      settings: {
        foreground: "#54b9ff",
      },
    },
    {
      name: "Go package name",
      scope: ["entity.name.package.go"],
      settings: {
        foreground: "#acafff",
      },
    },
    {
      name: "elm prelude",
      scope: ["support.type.prelude.elm"],
      settings: {
        foreground: "#eef0f9",
      },
    },
    {
      name: "elm constant",
      scope: ["support.constant.elm"],
      settings: {
        foreground: "#ffd493",
      },
    },
    {
      name: "template literal",
      scope: ["punctuation.quasi.element"],
      settings: {
        foreground: "#54b9ff",
      },
    },
    {
      name: "html/pug (jade) escaped characters and entities",
      scope: ["constant.character.entity"],
      settings: {
        foreground: "#4bf3c8",
      },
    },
    {
      name: "styling css pseudo-elements/classes to be able to differentiate from classes which are the same colour",
      scope: [
        "entity.other.attribute-name.pseudo-element",
        "entity.other.attribute-name.pseudo-class",
      ],
      settings: {
        foreground: "#eef0f9",
      },
    },
    {
      name: "Clojure globals",
      scope: ["entity.global.clojure"],
      settings: {
        foreground: "#acafff",
      },
    },
    {
      name: "Clojure symbols",
      scope: ["meta.symbol.clojure"],
      settings: {
        foreground: "#4bf3c8",
      },
    },
    {
      name: "Clojure constants",
      scope: ["constant.keyword.clojure"],
      settings: {
        foreground: "#eef0f9",
      },
    },
    {
      name: "CoffeeScript Function Argument",
      scope: ["meta.arguments.coffee", "variable.parameter.function.coffee"],
      settings: {
        foreground: "#4bf3c8",
      },
    },
    {
      name: "Ini Default Text",
      scope: ["source.ini"],
      settings: {
        foreground: "#ffd493",
      },
    },
    {
      name: "Makefile prerequisities",
      scope: ["meta.scope.prerequisites.makefile"],
      settings: {
        foreground: "#4bf3c8",
      },
    },
    {
      name: "Makefile text colour",
      scope: ["source.makefile"],
      settings: {
        foreground: "#acafff",
      },
    },
    {
      name: "Groovy import names",
      scope: ["storage.modifier.import.groovy"],
      settings: {
        foreground: "#acafff",
      },
    },
    {
      name: "Groovy Methods",
      scope: ["meta.method.groovy"],
      settings: {
        foreground: "#00daef",
      },
    },
    {
      name: "Groovy Variables",
      scope: ["meta.definition.variable.name.groovy"],
      settings: {
        foreground: "#4bf3c8",
      },
    },
    {
      name: "Groovy Inheritance",
      scope: ["meta.definition.class.inherited.classes.groovy"],
      settings: {
        foreground: "#ffd493",
      },
    },
    {
      name: "HLSL Semantic",
      scope: ["support.variable.semantic.hlsl"],
      settings: {
        foreground: "#acafff",
      },
    },
    {
      name: "HLSL Types",
      scope: [
        "support.type.texture.hlsl",
        "support.type.sampler.hlsl",
        "support.type.object.hlsl",
        "support.type.object.rw.hlsl",
        "support.type.fx.hlsl",
        "support.type.object.hlsl",
      ],
      settings: {
        foreground: "#54b9ff",
      },
    },
    {
      name: "SQL Variables",
      scope: ["text.variable", "text.bracketed"],
      settings: {
        foreground: "#4bf3c8",
      },
    },
    {
      name: "types",
      scope: ["support.type.swift", "support.type.vb.asp"],
      settings: {
        foreground: "#acafff",
      },
    },
    {
      name: "heading 1, keyword",
      scope: ["entity.name.function.xi"],
      settings: {
        foreground: "#acafff",
      },
    },
    {
      name: "heading 2, callable",
      scope: ["entity.name.class.xi"],
      settings: {
        foreground: "#eef0f9",
      },
    },
    {
      name: "heading 3, property",
      scope: ["constant.character.character-class.regexp.xi"],
      settings: {
        foreground: "#4bf3c8",
      },
    },
    {
      name: "heading 4, type, class, interface",
      scope: ["constant.regexp.xi"],
      settings: {
        foreground: "#54b9ff",
      },
    },
    {
      name: "heading 5, enums, preprocessor, constant, decorator",
      scope: ["keyword.control.xi"],
      settings: {
        foreground: "#eef0f9",
      },
    },
    {
      name: "heading 6, number",
      scope: ["invalid.xi"],
      settings: {
        foreground: "#eef0f9",
      },
    },
    {
      name: "string",
      scope: ["beginning.punctuation.definition.quote.markdown.xi"],
      settings: {
        foreground: "#ffd493",
      },
    },
    {
      name: "comments",
      scope: ["beginning.punctuation.definition.list.markdown.xi"],
      settings: {
        foreground: "#eef0f98f",
      },
    },
    {
      name: "link",
      scope: ["constant.character.xi"],
      settings: {
        foreground: "#00daef",
      },
    },
    {
      name: "accent",
      scope: ["accent.xi"],
      settings: {
        foreground: "#00daef",
      },
    },
    {
      name: "wikiword",
      scope: ["wikiword.xi"],
      settings: {
        foreground: "#ffd493",
      },
    },
    {
      name: "language operators like '+', '-' etc",
      scope: ["constant.other.color.rgb-value.xi"],
      settings: {
        foreground: "#ffffff",
      },
    },
    {
      name: "elements to dim",
      scope: ["punctuation.definition.tag.xi"],
      settings: {
        foreground: "#545864",
      },
    },
    {
      name: "C++/C#",
      scope: [
        "entity.name.label.cs",
        "entity.name.scope-resolution.function.call",
        "entity.name.scope-resolution.function.definition",
      ],
      settings: {
        foreground: "#acafff",
      },
    },
    {
      name: "Markdown underscore-style headers",
      scope: [
        "entity.name.label.cs",
        "markup.heading.setext.1.markdown",
        "markup.heading.setext.2.markdown",
      ],
      settings: {
        foreground: "#4bf3c8",
      },
    },
    {
      name: "meta.brace.square",
      scope: [" meta.brace.square"],
      settings: {
        foreground: "#eef0f9",
      },
    },
    {
      name: "Comments",
      scope: "comment, punctuation.definition.comment",
      settings: {
        fontStyle: "italic",
        foreground: "#eef0f98f",
      },
    },
    {
      name: "[VSCODE-CUSTOM] Markdown Quote",
      scope: "markup.quote.markdown",
      settings: {
        foreground: "#eef0f98f",
      },
    },
    {
      name: "punctuation.definition.block.sequence.item.yaml",
      scope: "punctuation.definition.block.sequence.item.yaml",
      settings: {
        foreground: "#eef0f9",
      },
    },
    {
      scope: ["constant.language.symbol.elixir"],
      settings: {
        foreground: "#eef0f9",
      },
    },
    {
      name: "js/ts italic",
      scope:
        "entity.other.attribute-name.js,entity.other.attribute-name.ts,entity.other.attribute-name.jsx,entity.other.attribute-name.tsx,variable.parameter,variable.language.super",
      settings: {
        fontStyle: "italic",
      },
    },
    {
      name: "comment",
      scope: "comment.line.double-slash,comment.block.documentation",
      settings: {
        fontStyle: "italic",
      },
    },
    {
      name: "Python Keyword Control",
      scope: "keyword.control.import.python,keyword.control.flow.python",
      settings: {
        fontStyle: "italic",
      },
    },
    {
      name: "markup.italic.markdown",
      scope: "markup.italic.markdown",
      settings: {
        fontStyle: "italic",
      },
    },
  ],
  colors: {
    foreground: "#cccccc",
    focusBorder: "#00daef",
    "activityBar.activeBackground": "#343841",
    "activityBar.background": "#17191e",
    "activityBar.border": "#343841",
    "activityBar.foreground": "#eef0f9",
    "activityBar.inactiveForeground": "#858b98",
    "activityBarBadge.background": "#4bf3c8",
    "activityBarBadge.foreground": "#000000",
    "badge.background": "#bfc1c9",
    "badge.foreground": "#17191e",
    "breadcrumb.activeSelectionForeground": "#eef0f9",
    "breadcrumb.background": "#17191e",
    "breadcrumb.focusForeground": "#eef0f9",
    "breadcrumb.foreground": "#858b98",
    "button.background": "#4bf3c8",
    "button.foreground": "#17191e",
    "button.hoverBackground": "#31c19c",
    "button.secondaryBackground": "#545864",
    "button.secondaryForeground": "#eef0f9",
    "button.secondaryHoverBackground": "#858b98",
    "checkbox.background": "#23262d",
    "checkbox.border": "#00000000",
    "checkbox.foreground": "#eef0f9",
    "debugExceptionWidget.background": "#23262d",
    "debugExceptionWidget.border": "#8996d5",
    "debugToolBar.background": "#000",
    "debugToolBar.border": "#ffffff00",
    "diffEditor.border": "#ffffff00",
    "diffEditor.insertedTextBackground": "#4bf3c824",
    "diffEditor.removedTextBackground": "#dc365724",
    "dropdown.background": "#23262d",
    "dropdown.border": "#00000000",
    "dropdown.foreground": "#eef0f9",
    "editor.background": "#17191e",
    "editor.findMatchBackground": "#515c6a",
    "editor.findMatchBorder": "#74879f",
    "editor.findMatchHighlightBackground": "#ea5c0055",
    "editor.findMatchHighlightBorder": "#ffffff00",
    "editor.findRangeHighlightBackground": "#23262d",
    "editor.findRangeHighlightBorder": "#b2434300",
    "editor.foldBackground": "#ad5dca26",
    "editor.foreground": "#eef0f9",
    "editor.hoverHighlightBackground": "#5495d740",
    "editor.inactiveSelectionBackground": "#2a2d34",
    "editor.lineHighlightBackground": "#23262d",
    "editor.lineHighlightBorder": "#ffffff00",
    "editor.rangeHighlightBackground": "#ffffff0b",
    "editor.rangeHighlightBorder": "#ffffff00",
    "editor.selectionBackground": "#ad5dca44",
    "editor.selectionHighlightBackground": "#add6ff34",
    "editor.selectionHighlightBorder": "#495f77",
    "editor.wordHighlightBackground": "#494949b8",
    "editor.wordHighlightStrongBackground": "#004972b8",
    "editorBracketMatch.background": "#545864",
    "editorBracketMatch.border": "#ffffff00",
    "editorCodeLens.foreground": "#bfc1c9",
    "editorCursor.background": "#000000",
    "editorCursor.foreground": "#aeafad",
    "editorError.background": "#ffffff00",
    "editorError.border": "#ffffff00",
    "editorError.foreground": "#f4587e",
    "editorGroup.border": "#343841",
    "editorGroup.emptyBackground": "#17191e",
    "editorGroupHeader.border": "#ffffff00",
    "editorGroupHeader.tabsBackground": "#23262d",
    "editorGroupHeader.tabsBorder": "#ffffff00",
    "editorGutter.addedBackground": "#4bf3c8",
    "editorGutter.background": "#17191e",
    "editorGutter.commentRangeForeground": "#545864",
    "editorGutter.deletedBackground": "#f06788",
    "editorGutter.foldingControlForeground": "#545864",
    "editorGutter.modifiedBackground": "#54b9ff",
    "editorHoverWidget.background": "#252526",
    "editorHoverWidget.border": "#454545",
    "editorHoverWidget.foreground": "#cccccc",
    "editorIndentGuide.activeBackground": "#858b98",
    "editorIndentGuide.background": "#343841",
    "editorInfo.background": "#4490bf00",
    "editorInfo.border": "#4490bf00",
    "editorInfo.foreground": "#54b9ff",
    "editorLineNumber.activeForeground": "#858b98",
    "editorLineNumber.foreground": "#545864",
    "editorLink.activeForeground": "#54b9ff",
    "editorMarkerNavigation.background": "#23262d",
    "editorMarkerNavigationError.background": "#dc3657",
    "editorMarkerNavigationInfo.background": "#54b9ff",
    "editorMarkerNavigationWarning.background": "#ffd493",
    "editorOverviewRuler.background": "#ffffff00",
    "editorOverviewRuler.border": "#ffffff00",
    "editorRuler.foreground": "#545864",
    "editorSuggestWidget.background": "#252526",
    "editorSuggestWidget.border": "#454545",
    "editorSuggestWidget.foreground": "#d4d4d4",
    "editorSuggestWidget.highlightForeground": "#0097fb",
    "editorSuggestWidget.selectedBackground": "#062f4a",
    "editorWarning.background": "#a9904000",
    "editorWarning.border": "#ffffff00",
    "editorWarning.foreground": "#fbc23b",
    "editorWhitespace.foreground": "#cc75f450",
    "editorWidget.background": "#343841",
    "editorWidget.foreground": "#ffffff",
    "editorWidget.resizeBorder": "#cc75f4",
    "gitDecoration.addedResourceForeground": "#4bf3c8",
    "gitDecoration.conflictingResourceForeground": "#00daef",
    "gitDecoration.deletedResourceForeground": "#f4587e",
    "gitDecoration.ignoredResourceForeground": "#858b98",
    "gitDecoration.modifiedResourceForeground": "#ffd493",
    "gitDecoration.stageDeletedResourceForeground": "#c74e39",
    "gitDecoration.stageModifiedResourceForeground": "#ffd493",
    "gitDecoration.submoduleResourceForeground": "#54b9ff",
    "gitDecoration.untrackedResourceForeground": "#4bf3c8",
    "icon.foreground": "#cccccc",
    "input.background": "#23262d",
    "input.border": "#bfc1c9",
    "input.foreground": "#eef0f9",
    "input.placeholderForeground": "#858b98",
    "inputOption.activeBackground": "#54b9ff",
    "inputOption.activeBorder": "#007acc00",
    "inputOption.activeForeground": "#17191e",
    "list.activeSelectionBackground": "#2d4860",
    "list.activeSelectionForeground": "#ffffff",
    "list.dropBackground": "#17191e",
    "list.focusBackground": "#54b9ff",
    "list.focusForeground": "#ffffff",
    "list.highlightForeground": "#ffffff",
    "list.hoverBackground": "#343841",
    "list.hoverForeground": "#eef0f9",
    "list.inactiveSelectionBackground": "#17191e",
    "list.inactiveSelectionForeground": "#eef0f9",
    "listFilterWidget.background": "#2d4860",
    "listFilterWidget.noMatchesOutline": "#dc3657",
    "listFilterWidget.outline": "#54b9ff",
    "menu.background": "#252526",
    "menu.border": "#00000085",
    "menu.foreground": "#cccccc",
    "menu.selectionBackground": "#094771",
    "menu.selectionBorder": "#00000000",
    "menu.selectionForeground": "#4bf3c8",
    "menu.separatorBackground": "#bbbbbb",
    "menubar.selectionBackground": "#ffffff1a",
    "menubar.selectionForeground": "#cccccc",
    "merge.commonContentBackground": "#282828",
    "merge.commonHeaderBackground": "#383838",
    "merge.currentContentBackground": "#27403b",
    "merge.currentHeaderBackground": "#367366",
    "merge.incomingContentBackground": "#28384b",
    "merge.incomingHeaderBackground": "#395f8f",
    "minimap.background": "#17191e",
    "minimap.errorHighlight": "#dc3657",
    "minimap.findMatchHighlight": "#515c6a",
    "minimap.selectionHighlight": "#3757b942",
    "minimap.warningHighlight": "#fbc23b",
    "minimapGutter.addedBackground": "#4bf3c8",
    "minimapGutter.deletedBackground": "#f06788",
    "minimapGutter.modifiedBackground": "#54b9ff",
    "notificationCenter.border": "#ffffff00",
    "notificationCenterHeader.background": "#343841",
    "notificationCenterHeader.foreground": "#17191e",
    "notifications.background": "#343841",
    "notifications.border": "#bfc1c9",
    "notifications.foreground": "#ffffff",
    "notificationsErrorIcon.foreground": "#f4587e",
    "notificationsInfoIcon.foreground": "#54b9ff",
    "notificationsWarningIcon.foreground": "#ff8551",
    "notificationToast.border": "#ffffff00",
    "panel.background": "#23262d",
    "panel.border": "#17191e",
    "panelSection.border": "#17191e",
    "panelTitle.activeBorder": "#e7e7e7",
    "panelTitle.activeForeground": "#eef0f9",
    "panelTitle.inactiveForeground": "#bfc1c9",
    "peekView.border": "#007acc",
    "peekViewEditor.background": "#001f33",
    "peekViewEditor.matchHighlightBackground": "#ff8f0099",
    "peekViewEditor.matchHighlightBorder": "#ee931e",
    "peekViewEditorGutter.background": "#001f33",
    "peekViewResult.background": "#252526",
    "peekViewResult.fileForeground": "#ffffff",
    "peekViewResult.lineForeground": "#bbbbbb",
    "peekViewResult.matchHighlightBackground": "#f00",
    "peekViewResult.selectionBackground": "#3399ff33",
    "peekViewResult.selectionForeground": "#ffffff",
    "peekViewTitle.background": "#1e1e1e",
    "peekViewTitleDescription.foreground": "#ccccccb3",
    "peekViewTitleLabel.foreground": "#ffffff",
    "pickerGroup.border": "#ffffff00",
    "pickerGroup.foreground": "#eef0f9",
    "progressBar.background": "#4bf3c8",
    "scrollbar.shadow": "#000000",
    "scrollbarSlider.activeBackground": "#54b9ff66",
    "scrollbarSlider.background": "#54586466",
    "scrollbarSlider.hoverBackground": "#545864B3",
    "selection.background": "#00daef56",
    "settings.focusedRowBackground": "#ffffff07",
    "settings.headerForeground": "#cccccc",
    "sideBar.background": "#23262d",
    "sideBar.border": "#17191e",
    "sideBar.dropBackground": "#17191e",
    "sideBar.foreground": "#bfc1c9",
    "sideBarSectionHeader.background": "#343841",
    "sideBarSectionHeader.border": "#17191e",
    "sideBarSectionHeader.foreground": "#eef0f9",
    "sideBarTitle.foreground": "#eef0f9",
    "statusBar.background": "#17548b",
    "statusBar.debuggingBackground": "#cc75f4",
    "statusBar.debuggingForeground": "#eef0f9",
    "statusBar.foreground": "#eef0f9",
    "statusBar.noFolderBackground": "#6c3c7d",
    "statusBar.noFolderForeground": "#eef0f9",
    "statusBarItem.activeBackground": "#ffffff25",
    "statusBarItem.hoverBackground": "#ffffff1f",
    "statusBarItem.remoteBackground": "#297763",
    "statusBarItem.remoteForeground": "#eef0f9",
    "tab.activeBackground": "#17191e",
    "tab.activeBorder": "#ffffff00",
    "tab.activeBorderTop": "#eef0f9",
    "tab.activeForeground": "#eef0f9",
    "tab.border": "#17191e",
    "tab.hoverBackground": "#343841",
    "tab.hoverForeground": "#eef0f9",
    "tab.inactiveBackground": "#23262d",
    "tab.inactiveForeground": "#858b98",
    "terminal.ansiBrightBlack": "#545864",
    "terminal.ansiBrightBlue": "#54b9ff",
    "terminal.ansiBrightCyan": "#00daef",
    "terminal.ansiBrightGreen": "#4bf3c8",
    "terminal.ansiBrightMagenta": "#cc75f4",
    "terminal.ansiBrightRed": "#f4587e",
    "terminal.ansiBrightWhite": "#fafafa",
    "terminal.ansiBrightYellow": "#ffd493",
    "terminal.ansiBlack": "#17191e",
    "terminal.ansiBlue": "#2b7eca",
    "terminal.ansiCyan": "#24c0cf",
    "terminal.ansiGreen": "#23d18b",
    "terminal.ansiMagenta": "#ad5dca",
    "terminal.ansiRed": "#dc3657",
    "terminal.ansiWhite": "#eef0f9",
    "terminal.ansiYellow": "#ffc368",
    "terminal.border": "#80808059",
    "terminal.foreground": "#cccccc",
    "terminal.selectionBackground": "#ffffff40",
    "terminalCursor.background": "#0087ff",
    "terminalCursor.foreground": "#ffffff",
    "textLink.foreground": "#54b9ff",
    "titleBar.activeBackground": "#17191e",
    "titleBar.activeForeground": "#cccccc",
    "titleBar.border": "#00000000",
    "titleBar.inactiveBackground": "#3c3c3c99",
    "titleBar.inactiveForeground": "#cccccc99",
    "tree.indentGuidesStroke": "#545864",
    "walkThrough.embeddedEditorBackground": "#00000050",
    "widget.shadow": "#ffffff00",
  },
};

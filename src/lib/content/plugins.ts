// @ts-nocheck
import { Element, Root } from "hast";
import { h } from "hastscript";
import { Root as MdastRoot } from "mdast";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { SKIP, visit } from "unist-util-visit";

export const rehypeCode = () => {
  return (tree: Root) => {
    visit(tree, "element", (node, index, parent) => {
      if (node.tagName === "language-switcher") {
        const pres = node.children
          .filter(
            (child) => child.type === "element" && child.tagName === "pre"
          )
          .map((child) => child.type === "element" && child.children[0]);

        const nodes = pres.map((pre) =>
          transformCode(
            pre.children[0] as Text,
            getLangFromClass(pre.properties.className)
          )
        );
        node.properties.data = JSON.stringify(
          nodes.map((node) => ({
            lang: node.properties.lang,
            code: node.properties.value,
          }))
        );

        return;
      }

      if (
        node.tagName === "pre" &&
        node.children.length === 1 &&
        (node.children[0] as Element).tagName === "code"
      ) {
        const codeElement = node.children[0] as Element;

        const codeChildren = codeElement.children[0];
        if (!(codeChildren.type === "text")) {
          return;
        }

        const codeNode = transformCode(
          codeChildren,
          getLangFromClass(codeElement.properties.className)
        );
        if (parent && typeof index === "number") {
          parent.children.splice(index, 1, codeNode);
        }
      }

      // Handle inline code
      if (node.tagName === "em") {
        const lang = node.children[0].value;
        const code = node.children[1]?.children[0].value;
        if (lang && code) {
          const inlineCodeNode = {
            type: "element",
            tagName: "code-inline",
            properties: {
              value: code,
              lang,
            },
          };
          parent.children.splice(index, 1, inlineCodeNode);
        }
      }
    });
  };
};

export const rehypeCodeInline = () => {
  return (tree: Root) => {
    visit(tree, "element", (node, index, parent) => {
      if (node.tagName === "em") {
        const lang = node.children[0].value;
        const code = node.children[1]?.children[0].value;
        if (lang && code) {
          const inlineCodeNode = {
            type: "element",
            tagName: "code-inline",
            properties: {
              value: code,
              lang,
            },
          };
          parent.children.splice(index, 1, inlineCodeNode);
        }
      }
    });
  };
};

const langMap: Record<string, string> = {
  default: "markdown",
};

const getLangFromClass = (className: string[] | string | undefined | null) => {
  if (!className) {
    return undefined;
  }
  if (typeof className === "string") {
    const lang = className?.split("-")[1];
    return langMap[lang] || lang;
  }
  const lang = className?.[0].split("-")[1];
  return lang ? langMap[lang] || lang : undefined;
};

const transformCode = (node: Text, lang: string) => {
  const value = node.value;
  const lines = value.split("\n");

  let meta: Record<string, string> | undefined = undefined;

  const codeLines: string[] = [];
  const metaLines: string[] = [];
  for (const line of lines) {
    if (line.startsWith("#|")) {
      metaLines.push(line);
    } else {
      codeLines.push(line);
    }
  }

  if (metaLines.length > 0) {
    meta = metaLines.reduce(
      (acc, line) => {
        const [key, value] = line.replace("#|", "").trim().split(":");
        acc[key] = value;
        return acc;
      },
      {} as Record<string, string>
    );
  }
  const code = codeLines.join("\n");
  const codeNode = {
    type: "element",
    tagName: "code-block",
    properties: {
      id: meta?.ref,
      value: code,
      lang,
      filename: meta?.filename,
      caption: meta?.caption
        ? unified()
            .use(remarkParse)
            .use(remarkRehype)
            .use(rehypeStringify)
            .processSync(meta.caption)
            .toString()
        : undefined,
    },
  };

  return codeNode;
};

export const rehypeUnwrapImages = () => {
  return (tree: Root) => {
    visit(tree, "element", (node, index, parent) => {
      if (node.tagName === "p" && typeof index === "number" && parent) {
        const child = node.children[0];
        if (child.type === "element" && child.tagName === "img") {
          parent.children.splice(index, 1, child);
          return [SKIP, index];
        }
      }
    });
  };
};

export const remarkUseDirective = () => {
  return (tree: MdastRoot) => {
    visit(tree, (node) => {
      if (
        node.type === "containerDirective" ||
        node.type === "leafDirective" ||
        node.type === "textDirective"
      ) {
        const data = node.data || (node.data = {});
        const hast = h(node.name, node.attributes || {});
        data.hName = hast.tagName;
        data.hProperties = hast.properties;
      }
    });
  };
};

import Slugger from "github-slugger";
import { Element, Nodes } from "hast";
import { toString } from "hast-util-to-string";

interface ExtractedHeading {
  depth: 2 | 3;
  slug: string;
  html: string;
}

function getHeadingsFromHast(tree: Nodes): ExtractedHeading[] {
  const slugger = new Slugger();
  const headings: ExtractedHeading[] = [];

  function visitor(node: Element) {
    if (
      node.type === "element" &&
      (node.tagName === "h2" || node.tagName === "h3")
    ) {
      const depth = parseInt(node.tagName.charAt(1)) as 2 | 3;
      const text = toString(node);
      const slug = slugger.slug(text);

      // Convert the heading element to an HTML string suitable for use inside an <a> tag
      const html = headingToInnerHtml(node);

      headings.push({ depth, slug, html });
    }

    if (node.children) {
      node.children.forEach((child) => {
        if (child.type === "element") visitor(child);
      });
    }
  }

  if (tree.type === "root") {
    tree.children.forEach((node) => {
      if (node.type === "element") visitor(node);
    });
  }

  return headings;
}

// Helper function to convert a heading element to inner HTML suitable for use inside an <a> tag
function headingToInnerHtml(node: Element): string {
  return node.children
    .map((child) => {
      if (child.type === "text") {
        return escapeHtml(child.value);
      }
      if (child.type === "element") {
        // For nested elements, we'll convert them to spans to avoid nesting interactive elements
        const tag = child.tagName === "a" ? "span" : child.tagName;
        const attributes = Object.entries(child.properties || {})
          .filter(([key]) => key !== "href") // Remove href attribute
          .map(([key, value]) => `${key}="${escapeHtml(String(value))}"`)
          .join(" ");
        const innerHtml = headingToInnerHtml(child);
        return `<${tag}${attributes ? " " + attributes : ""}>${innerHtml}</${tag}>`;
      }
      return "";
    })
    .join("");
}

// Helper function to escape HTML special characters
function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export { getHeadingsFromHast };

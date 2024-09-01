import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

const processor = unified().use([
  remarkParse,
  remarkRehype,
  rehypeRaw,
  rehypeStringify,
]);

interface TocEntry {
  depth: 2 | 3;
  slug: string;
  html: string;
}
export function extractToc(content: Uint8Array): TocEntry[] {
  const decoder = new TextDecoder();

  // Define BEGIN_TOC and END_TOC as Uint8Arrays
  const beginToc = new Uint8Array([66, 69, 71, 73, 78, 95, 84, 79, 67]); // 'BEGIN_TOC'
  const endToc = new Uint8Array([69, 78, 68, 95, 84, 79, 67]); // 'END_TOC'
  let start = -1;
  let end = -1;
  // Search for BEGIN_TOC
  for (let i = 0; i < content.length - beginToc.length; i++) {
    if (
      content[i] === beginToc[0] &&
      content
        .subarray(i, i + beginToc.length)
        .every((value, index) => value === beginToc[index])
    ) {
      start = i + beginToc.length;
      break;
    }
  }

  if (start === -1) return [];

  // Search for END_TOC
  for (let i = start; i < content.length - endToc.length; i++) {
    if (
      content[i] === endToc[0] &&
      content
        .subarray(i, i + endToc.length)
        .every((value, index) => value === endToc[index])
    ) {
      end = i;
      break;
    }
  }

  if (end === -1) return [];

  // Extract and process TOC content
  const tocContent = decoder.decode(content.subarray(start, end)).trim();
  const lines = tocContent.split("\n");

  return lines.map((line) => {
    const [, indent, title, slug, depth] =
      line.match(/^(\s*)- (.+?)\|(.+?)\|(\d+)$/) || [];
    return {
      html: processor.processSync(title).value as string,
      slug,
      depth: parseInt(depth, 10) as 2 | 3,
    };
  });
}

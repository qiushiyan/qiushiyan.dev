import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

export const htmlProcessor = unified().use([
  remarkParse,
  remarkRehype,
  rehypeRaw,
  rehypeStringify,
]);

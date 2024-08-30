import { CodeBlock } from "@/components/codehike/code-block";
import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    Code: CodeBlock,
  };
}

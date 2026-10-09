import { Inline } from "codehike/code";

import { inlineCodeClasses } from "@/components/prose-wrapper";
import { parseHighlighted } from "./highlighted";

/** `*ts`code`*` in Markdown: inline code with build-time highlighting, on the shared code chip. */
export function InlineCode({
  value,
  highlighted,
}: {
  value: string;
  lang?: string;
  highlighted?: string;
}) {
  if (!highlighted) {
    return <code className={inlineCodeClasses}>{value}</code>;
  }

  const code = parseHighlighted(highlighted);
  return (
    <Inline
      code={code}
      // Only the text colour: the chip background comes from the shared class
      style={{ color: code.style.color }}
      className={inlineCodeClasses}
    />
  );
}

/** Plain `code` outside prose (descriptions in not-prose headers). */
export function PlainInlineCode({ children }: { children?: React.ReactNode }) {
  return <code className={inlineCodeClasses}>{children}</code>;
}

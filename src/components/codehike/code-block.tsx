import { cn } from "@/lib/utils";
import { codeSurfaceClasses, preClasses } from "./classes";
import { CopyButton } from "./copy-button";
import { decodeAttribute } from "./encoding";

// Props arrive as attributes of the build-time HTML (see src/lib/content/rehype-code.ts).
type CodeBlockProps = {
  /** The code to copy, base64 */
  value: string;
  lang?: string;
  filename?: string;
  /** HTML rendered from the `#| caption:` line */
  caption?: string;
  /** The highlighted <pre>, base64; absent only if highlighting failed */
  html?: string;
};

/** A code block: the build-time <pre> on the code surface, with a copy button. */
export const CodeBlock = ({
  value,
  filename,
  caption,
  html,
}: CodeBlockProps) => {
  const code = decodeAttribute(value);
  return (
    <figure className="not-prose my-6">
      <div className={codeSurfaceClasses}>
        {filename ? (
          <div className="flex h-10 items-center justify-between gap-4 border-b pr-1 pl-4 font-mono text-sm text-muted-foreground">
            <span className="truncate">{filename}</span>
            <CopyButton text={code} className="relative top-auto right-auto" />
          </div>
        ) : (
          <CopyButton text={code} />
        )}
        <CodeBody html={html && decodeAttribute(html)} code={code} />
      </div>
      {caption && (
        <figcaption
          className="mt-2 text-center text-sm text-pretty text-muted-foreground"
          dangerouslySetInnerHTML={{ __html: caption }}
        />
      )}
    </figure>
  );
};

/** The <pre> itself (decoded HTML, or plain code), shared with CodeSwitcher. */
export const CodeBody = ({ html, code }: { html?: string; code: string }) =>
  html ? (
    <div dangerouslySetInnerHTML={{ __html: html }} />
  ) : (
    <pre className={cn(preClasses, "px-4")}>
      <code>{code}</code>
    </pre>
  );

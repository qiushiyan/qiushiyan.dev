import { highlight, Pre } from "codehike/code";
import { FileCodeIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { CopyButton } from "./copy-button";
import { FootnoteNumber } from "./footnotes";
import { CodeHikeHandlers } from "./handlers";

type CodeBlockMeta = {
  filename?: string;
  caption?: string;
};

type CodeBlockProps = {
  value: string;
  lang?: string;
  customMeta?: CodeBlockMeta;
};

export const CodeBlock = async ({
  value,
  lang,
  customMeta,
}: CodeBlockProps) => {
  const highlighted = await highlight(
    { value, lang: lang ?? "", meta: "" },
    "github-from-css"
  );
  const noteAnnotations = highlighted.annotations.filter(
    ({ name }) => name === "ref"
  );
  const notes = noteAnnotations.map(({ query }) => query);

  noteAnnotations.forEach((a, index) => {
    a.data = { n: index + 1 };
  });

  const hasFilename = customMeta?.filename !== undefined;

  return (
    <figure className="my-2 py-2">
      {hasFilename && (
        <div className="relative my-0 rounded-tl-md rounded-tr-md border px-4 py-2 font-mono text-base text-muted-foreground">
          <div className="flex items-center gap-2">
            <FileCodeIcon className="size-4" />
            <span>{customMeta.filename}</span>
          </div>
          <CopyButton
            text={value}
            className="top-1/2 -translate-y-1/2 text-foreground hover:bg-background"
          />
        </div>
      )}
      <div className="relative mt-0">
        {!hasFilename && <CopyButton text={value} />}
        <Pre
          code={highlighted}
          handlers={CodeHikeHandlers}
          style={highlighted.style}
          className={cn("my-0 border p-2", hasFilename && "rounded-t-none")}
        />
      </div>
      {notes.length > 0 && (
        <ul className="my-2 list-none">
          {notes.map((ref, index) => (
            <li key={index} className="text-sm">
              <FootnoteNumber n={index + 1} />
              <span className="pl-1">{ref}</span>
            </li>
          ))}
        </ul>
      )}
      {customMeta?.caption && (
        <figcaption
          className="my-1 text-center text-sm text-muted-foreground"
          dangerouslySetInnerHTML={{
            __html: customMeta.caption,
          }}
        />
      )}
    </figure>
  );
};

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { codeSurfaceClasses } from "./classes";
import { CodeBody } from "./code-block";
import { CopyButton } from "./copy-button";
import { decodeAttribute } from "./encoding";

type Entry = {
  lang: string;
  code: string;
  filename?: string;
  /** The highlighted <pre>, rendered at build time */
  html?: string;
};

/** Several files in one code surface, with the file tabs in the header row. */
export const CodeSwitcher = ({ data }: { data: string }) => {
  // `data` is base64 JSON from the content build (src/lib/content/rehype-code.ts)
  const entries = JSON.parse(decodeAttribute(data)) as Entry[];
  if (entries.length === 0) return null;

  return (
    <Tabs defaultValue="0" className={cn("not-prose my-6", codeSurfaceClasses)}>
      {/* pr-10 keeps the last tab clear of the copy button */}
      <TabsList
        aria-label="Files"
        className="h-10 w-full justify-start overflow-x-auto rounded-none border-b bg-transparent p-0 pr-10"
      >
        {entries.map((entry, index) => (
          <TabsTrigger
            key={index}
            value={String(index)}
            className="h-10 shrink-0 rounded-none border-b-2 border-transparent px-4 font-mono text-sm font-normal text-muted-foreground shadow-none transition-colors duration-150 hover:text-foreground focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none"
          >
            {entry.filename ?? entry.lang}
          </TabsTrigger>
        ))}
      </TabsList>
      {entries.map((entry, index) => (
        <TabsContent
          key={index}
          value={String(index)}
          className="relative mt-0"
        >
          {/* Positioned up into the header row, beside the tabs */}
          <CopyButton text={entry.code} className="-top-9 right-1" />
          <CodeBody html={entry.html} code={entry.code} />
        </TabsContent>
      ))}
    </Tabs>
  );
};

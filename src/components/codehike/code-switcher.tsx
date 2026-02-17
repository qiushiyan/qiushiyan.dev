import { HighlightedCode, Pre } from "codehike/code";
import { FileCodeIcon } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { callout } from "./callout";
import { mark } from "./mark";

export const CodeSwitcher = ({ data }: { data: string }) => {
  const entries = (
    JSON.parse(data) as Array<{
      lang: string;
      code: string;
      filename?: string;
      highlighted?: HighlightedCode;
    }>
  ).map((entry, index) => ({
    ...entry,
    key: entry.filename || `tab ${index}`,
    highlightedCode: entry.highlighted,
  }));

  if (entries.length === 0) {
    return null;
  }

  return (
    <Tabs defaultValue={entries[0].key}>
      <TabsList className="mb-2 flex w-fit justify-start rounded-none p-0 font-mono">
        {entries.map((entry) => (
          <TabsTrigger
            key={entry.key}
            value={entry.key}
            className="inline-flex items-center gap-2 rounded-none px-6 data-[state=active]:border-l-4 xl:text-lg"
          >
            <FileCodeIcon className="size-4" />
            <span>{entry.key}</span>
          </TabsTrigger>
        ))}
      </TabsList>
      {entries.map((entry) => (
        <TabsContent
          key={entry.key}
          value={entry.key}
          className="rounded-md border"
        >
          {entry.highlightedCode ? (
            <Pre
              handlers={[callout, mark]}
              code={entry.highlightedCode}
              lang={entry.lang}
              style={entry.highlightedCode.style}
              className="my-2"
            />
          ) : (
            <pre className="my-2">
              <code>{entry.code}</code>
            </pre>
          )}
        </TabsContent>
      ))}
    </Tabs>
  );
};

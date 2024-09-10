import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/custom-tabs";
import { highlight, Pre } from "codehike/code";
import { FileCodeIcon } from "lucide-react";

export const CodeSwitcher = async ({ data }: { data: string }) => {
  const entries = await Promise.all(
    (
      JSON.parse(data) as Array<{
        lang: string;
        code: string;
        filename?: string;
      }>
    ).map(async (entry, index) => {
      const highlightedCode = await highlight(
        { value: entry.code, lang: entry.lang, meta: "" },
        "github-from-css"
      );
      return {
        ...entry,
        key: entry.filename || `tab ${index}`,
        highlightedCode,
      };
    })
  );

  return (
    <Tabs defaultValue={entries[0].key}>
      <TabsList className="mb-2 flex gap-2 font-mono">
        {entries.map((entry) => (
          <TabsTrigger
            key={entry.key}
            value={entry.key}
            className="inline-flex items-center gap-2 xl:text-lg"
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
          <Pre
            code={entry.highlightedCode}
            lang={entry.lang}
            style={entry.highlightedCode.style}
            className="my-2"
          />
        </TabsContent>
      ))}
    </Tabs>
  );
};

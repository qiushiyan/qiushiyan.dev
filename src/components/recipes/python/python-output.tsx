"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { PanelHeader } from "../recipes-layout";
import { usePython } from "./python-provider";

export const PythonOutput = () => {
  const { stdout, stderr, isLoading } = usePython();

  return (
    <>
      <PanelHeader>Output</PanelHeader>
      <ScrollArea className="min-h-0 flex-1">
        <pre className="p-3 font-mono text-sm/6 whitespace-pre-wrap">
          {isLoading ? (
            <span className="text-muted-foreground">Loading Python…</span>
          ) : (
            <>
              {stdout}
              <span className="text-destructive">{stderr}</span>
            </>
          )}
        </pre>
      </ScrollArea>
    </>
  );
};

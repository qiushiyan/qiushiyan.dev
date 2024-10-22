"use client";

import { Badge } from "@/components/ui/badge";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePython } from "./python-provider";

export const PythonOutput = () => {
  const { stdout, stderr } = usePython();
  return (
    <ResizablePanelGroup direction="vertical">
      <ResizablePanel defaultSize={60}>
        <ScrollArea className="relative h-full p-4">
          <Badge className="absolute right-2 top-2 bg-accent text-accent-foreground">
            Output
          </Badge>
          <pre>{stdout}</pre>
        </ScrollArea>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={40}>
        <ScrollArea className="h-full p-4">
          <Badge className="absolute right-2 top-2 bg-accent text-accent-foreground">
            Error
          </Badge>
          <pre className="text-destructive/80">{stderr}</pre>
        </ScrollArea>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

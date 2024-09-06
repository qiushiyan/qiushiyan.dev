"use client";

import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Loader2, RotateCcwIcon, TriangleIcon } from "lucide-react";

import { usePython } from "./python-provider";

export const EditorControl = ({ initialCode }: { initialCode: string }) => {
  const { run, isRunning, isLoading, setInput } = usePython();

  return (
    <div className="flex items-center gap-3">
      <Button
        variant={"outline"}
        className="items-center gap-2"
        onClick={() => run()}
        disabled={isRunning || isLoading}
      >
        {isRunning ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <TriangleIcon className="size-4 rotate-90" />
        )}
        <span>Run</span>
      </Button>
      <Button
        variant={"outline"}
        className="items-center gap-2"
        onClick={() => setInput(initialCode)}
      >
        <RotateCcwIcon className="size-4" />
        <span>Reset</span>
      </Button>
      <SidebarTrigger />
    </div>
  );
};

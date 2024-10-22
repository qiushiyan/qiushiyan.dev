"use client";

import { Loader2, TriangleIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { usePython } from "./python-provider";

export const PythonControl = () => {
  const { run, isRunning, isLoading } = usePython();

  return (
    <div className="flex items-center gap-3">
      <Button
        variant={"outline"}
        className="items-center gap-2"
        onClick={() => run()}
        disabled={isRunning || isLoading}
      >
        {isRunning || isLoading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <TriangleIcon className="size-4 rotate-90" />
        )}
        <span>Run</span>
      </Button>
      {/* <Button
        variant={"outline"}
        className="items-center gap-2"
        onClick={() => setInput(initialCode)}
      >
        <RotateCcwIcon className="size-4" />
        <span>Reset</span>
      </Button> */}
      <SidebarTrigger />
    </div>
  );
};

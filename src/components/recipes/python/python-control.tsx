"use client";

import { Loader2Icon, PlayIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { usePython } from "./python-provider";

export const PythonControl = () => {
  const { run, isRunning, isLoading } = usePython();
  const busy = isRunning || isLoading;

  return (
    <Button
      variant="outline"
      size="sm"
      className="gap-1.5 pr-3 pl-2.5"
      onClick={run}
      disabled={busy}
      title="Run (⌘/Ctrl + Enter)"
    >
      {busy ? (
        <Loader2Icon
          aria-hidden
          className="size-3.5 motion-safe:animate-spin"
        />
      ) : (
        // The triangle's visual centre sits left of its box, so nudge it right.
        <PlayIcon
          aria-hidden
          className="size-3.5 translate-x-px fill-current"
        />
      )}
      Run
    </Button>
  );
};

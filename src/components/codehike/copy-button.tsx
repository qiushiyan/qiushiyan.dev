"use client";

import { useEffect, useState } from "react";
import { CheckIcon, CopyIcon } from "lucide-react";

import { cn } from "@/lib/utils";

const iconClasses =
  "col-start-1 row-start-1 size-4 transition-[opacity,filter,scale] duration-300 ease-[cubic-bezier(0.2,0,0,1)] motion-reduce:transition-none";
const shown = "scale-100 opacity-100 blur-none";
const hidden = "scale-[0.25] opacity-0 blur-[4px]";

export function CopyButton({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timeout = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(timeout);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      // Clipboard access can be denied (permissions, insecure context);
      // the icon simply doesn't change.
    }
  };

  return (
    <>
      <button
        type="button"
        aria-label="Copy code"
        onClick={copy}
        className={cn(
          // 32px visible, 40px hit area; the code-coloured fill masks code scrolled beneath it
          "absolute top-1.5 right-1.5 z-10 grid size-8 place-items-center rounded-md bg-(--code-17) text-muted-foreground transition-colors duration-150 after:absolute after:-inset-1 after:content-[''] hover:bg-muted hover:text-foreground",
          className
        )}
      >
        <span className="grid place-items-center" aria-hidden>
          <CopyIcon className={cn(iconClasses, copied ? hidden : shown)} />
          <CheckIcon className={cn(iconClasses, copied ? shown : hidden)} />
        </span>
      </button>
      <span className="sr-only" role="status" aria-live="polite">
        {copied ? "Copied" : ""}
      </span>
    </>
  );
}

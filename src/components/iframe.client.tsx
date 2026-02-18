"use client";

import { useRef } from "react";
import { LinkIcon, RotateCw } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "./ui/button";

export const IFrameClient = ({
  src,
  ...props
}: React.ComponentProps<"iframe">) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleRefresh = () => {
    if (iframeRef.current) {
      iframeRef.current.contentWindow?.location.reload();
    }
  };

  return (
    <>
      <div className="flex items-center gap-4 bg-muted p-2 text-muted-foreground">
        <div className="flex items-center">
          <a
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              "!text-inherit"
            )}
            target="_blank"
            rel="noreferrer noopener"
            href={src}
            aria-label="Open in new tab"
          >
            <LinkIcon className="size-4" />
          </a>
          <Button variant="ghost" size="icon" onClick={handleRefresh} aria-label="Refresh">
            <RotateCw className="size-4" />
          </Button>
        </div>

        <div className="flex-grow">
          <input
            type="text"
            readOnly
            value={src}
            aria-label="Page URL"
            className="w-full rounded-lg bg-background px-3 py-1 text-foreground"
          />
        </div>
      </div>
      <iframe
        ref={iframeRef}
        src={src}
        className="h-full w-full border-none"
        title="Embedded content"
        loading="lazy"
        {...props}
      />
    </>
  );
};

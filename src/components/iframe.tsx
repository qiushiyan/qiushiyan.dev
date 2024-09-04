"use client";

import React, { useRef, useState } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LinkIcon, RotateCw } from "lucide-react";

export const MyIframe = ({
  src,
  caption,
  height,
  ...props
}: React.ComponentProps<"iframe"> & {
  caption?: string;
}) => {
  const [key, setKey] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleRefresh = () => {
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
    }
    setKey((prevKey) => prevKey + 1);
  };

  return (
    <div
      className={cn("flex flex-col overflow-hidden rounded-lg border-2")}
      style={{
        height: height ? height : "85vh",
      }}
    >
      <div className="flex items-center gap-4 bg-muted p-2 text-muted-foreground">
        <div className="flex items-center">
          <a
            className={buttonVariants({ variant: "ghost", size: "icon" })}
            target="_blank"
            href={src}
          >
            <LinkIcon className="size-4" />
          </a>
          <Button variant="ghost" size="icon" onClick={handleRefresh}>
            <RotateCw className="size-4" />
          </Button>
        </div>

        <div className="flex-grow">
          <input
            type="text"
            readOnly
            value={src}
            className="w-full rounded-lg bg-background px-3 py-1 text-foreground"
          />
        </div>
      </div>
      <iframe
        key={key}
        ref={iframeRef}
        src={src}
        className="h-full w-full border-none"
        title="Content"
        {...props}
      />
      {caption && (
        <div className="p-2 text-center text-sm text-muted-foreground">
          {caption}
        </div>
      )}
    </div>
  );
};

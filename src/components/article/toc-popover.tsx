"use client";

import { useRef, useState } from "react";
import { TableOfContentsIcon } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ArticleToc } from "./article-toc";
import type { TocHeading } from "./article-toc";

/** The table of contents below 80rem, where there is no room for the rail: a nav button. */
export function TocPopover({
  headings,
  className,
}: {
  headings: TocHeading[];
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const navigated = useRef(false);
  if (headings.length === 0) return null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        aria-label="On this page"
        className={cn(
          "grid size-10 place-items-center rounded-md text-muted-foreground transition-[color,scale] duration-150 ease-out hover:text-foreground active:scale-[0.96] max-md:size-11",
          className
        )}
      >
        <TableOfContentsIcon aria-hidden strokeWidth={1.5} className="size-5" />
      </PopoverTrigger>
      <PopoverContent
        align="end"
        collisionPadding={16}
        className="w-80 overflow-hidden rounded-lg p-0 text-sm/6"
        onCloseAutoFocus={(event) => {
          // After jumping to a section, leave focus at the section (where the
          // hash navigation put it) instead of pulling it back to the nav.
          if (navigated.current) event.preventDefault();
          navigated.current = false;
        }}
      >
        <nav
          aria-label="On this page"
          className="max-h-[min(70dvh,32rem)] overflow-y-auto p-3"
        >
          <ArticleToc
            headings={headings}
            itemClassName="py-2.5"
            onNavigate={() => {
              navigated.current = true;
              setOpen(false);
            }}
          />
        </nav>
      </PopoverContent>
    </Popover>
  );
}

"use client";

import { useEffect, useMemo, useRef } from "react";

import { useActiveHeading } from "@/hooks/use-active-heading";
import { cn } from "@/lib/utils";
import type { Post } from "#content";

export type TocHeading = Post["headings"][number];

/** The list of section links, with the reader's current section marked. */
export function ArticleToc({
  headings,
  itemClassName,
  onNavigate,
}: {
  headings: TocHeading[];
  itemClassName?: string;
  onNavigate?: () => void;
}) {
  const slugs = useMemo(
    () => headings.map((heading) => heading.slug),
    [headings]
  );
  const active = useActiveHeading(slugs);
  const listRef = useRef<HTMLUListElement>(null);

  // Long notes overflow the rail; keep the current entry inside its scroll area.
  useEffect(() => {
    const container = listRef.current?.parentElement;
    const link = listRef.current?.querySelector<HTMLElement>(
      '[aria-current="location"]'
    );
    if (!container || !link) return;
    const bounds = container.getBoundingClientRect();
    const rect = link.getBoundingClientRect();
    if (rect.top < bounds.top) {
      container.scrollTop -= bounds.top - rect.top;
    } else if (rect.bottom > bounds.bottom) {
      container.scrollTop += rect.bottom - bounds.bottom;
    }
  }, [active]);

  return (
    <ul ref={listRef} className="border-l">
      {headings.map((heading) => (
        <li key={heading.slug}>
          <a
            href={`#${heading.slug}`}
            aria-current={active === heading.slug ? "location" : undefined}
            onClick={onNavigate}
            className={cn(
              "-ml-px block border-l-2 border-transparent pr-2 text-pretty text-muted-foreground transition-colors duration-150 hover:text-foreground aria-[current=location]:border-primary aria-[current=location]:text-foreground",
              heading.depth === 3 ? "pl-6" : "pl-3.5",
              itemClassName
            )}
            dangerouslySetInnerHTML={{ __html: heading.html }}
          />
        </li>
      ))}
    </ul>
  );
}

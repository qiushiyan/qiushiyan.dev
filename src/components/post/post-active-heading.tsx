"use client";

import { useActiveHeading } from "@/hooks/use-active-heading";
import { useCurrentPost } from "@/hooks/use-current-post";
import { TableOfContents } from "lucide-react";

export function PostActiveHeading() {
  const post = useCurrentPost();
  const activeSlug = useActiveHeading({ headings: post?.headings ?? [] });
  const activeHeading = post?.headings.find(
    (heading) => heading.slug === activeSlug
  );

  return (
    <div className="flex items-center gap-2 text-muted-foreground">
      {activeHeading ? (
        <>
          <TableOfContents className="size-4" />
          <div
            dangerouslySetInnerHTML={{ __html: activeHeading.html }}
            className="fade-up"
            key={activeHeading.slug}
          />
        </>
      ) : null}
    </div>
  );
}

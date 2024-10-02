"use client";

import { useActiveHeading } from "@/hooks/use-active-heading";
import { useCurrentPost } from "@/hooks/use-current-post";
import { AnimatePresence, motion } from "framer-motion";
import { TableOfContents } from "lucide-react";

export function PostActiveHeading() {
  const post = useCurrentPost();
  const activeSlug = useActiveHeading({ headings: post?.headings ?? [] });
  const activeHeading = post?.headings.find(
    (heading) => heading.slug === activeSlug
  );

  return (
    <div className="flex items-center gap-2 text-muted-foreground">
      <AnimatePresence mode="wait">
        {activeHeading ? (
          <>
            <TableOfContents className="size-4" />
            <motion.div
              key={activeHeading.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              dangerouslySetInnerHTML={{ __html: activeHeading.html }}
            />
          </>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

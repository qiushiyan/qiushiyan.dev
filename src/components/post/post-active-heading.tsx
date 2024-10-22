"use client";

import Link from "next/link";
import { Post } from "#content";
import { TableOfContents } from "lucide-react";

import { useActiveHeading } from "@/hooks/use-active-heading";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { TocItem } from "./post-toc-item";

export function PostActiveHeading({
  headings,
}: {
  headings: Post["headings"];
}) {
  const activeSlug = useActiveHeading({ headings });
  const activeHeading = headings.find((heading) => heading.slug === activeSlug);

  return (
    <div className="flex items-center gap-1 text-muted-foreground">
      <>
        <Popover>
          <PopoverTrigger asChild>
            <Button size={"sm"} variant={"ghost"} className="px-2">
              <span className="sr-only">Toggle table of contents</span>
              <TableOfContents className="size-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <ul className="grid gap-1 text-sm">
              {headings.map((item) => (
                <li
                  key={item.slug}
                  className={cn("py-0.5", item.depth === 3 ? "ml-2" : "px-0")}
                >
                  <TocItem
                    slug={item.slug}
                    data-depth={item.depth}
                    data-heading-slug={item.slug}
                    className={
                      activeHeading?.slug === item.slug
                        ? "bg-muted text-muted-foreground"
                        : ""
                    }
                  >
                    <div dangerouslySetInnerHTML={{ __html: item.html }} />
                  </TocItem>
                </li>
              ))}
            </ul>
          </PopoverContent>
        </Popover>
        {activeHeading ? (
          <Link href={`#${activeHeading.slug}`}>
            <div
              dangerouslySetInnerHTML={{ __html: activeHeading.html }}
              className="fade-up"
              key={activeHeading.slug}
            />
          </Link>
        ) : null}
      </>
    </div>
  );
}

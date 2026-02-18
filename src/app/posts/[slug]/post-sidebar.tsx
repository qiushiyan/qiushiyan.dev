"use client";

import Link from "next/link";
import {
  ArrowRightIcon,
  AtomIcon,
  ChevronRight,
  TableOfContents,
} from "lucide-react";

import { TocItem } from "@/components/post/post-toc-item";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Sidebar, SidebarContent, SidebarItem } from "@/components/ui/sidebar";
import { useActiveHeading } from "@/hooks/use-active-heading";
import { useCurrentPost } from "@/hooks/use-current-post";
import { getPostsByTags } from "@/lib/content/posts";
import { routes } from "@/lib/navigation";
import { cn } from "@/lib/utils";

export function PostSidebar() {
  return (
    <Sidebar>
      <SidebarContent className="gap-2">
        <SidebarItem>
          <PostToc />
        </SidebarItem>
        <SidebarItem>
          <SimilarPosts />
        </SidebarItem>
      </SidebarContent>
    </Sidebar>
  );
}

const SimilarPosts = () => {
  const post = useCurrentPost();

  if (!post) return null;

  const similarPosts = getPostsByTags(post.tags).filter(
    (p) => p.slug !== post.slug
  );

  if (similarPosts.length === 0) return null;

  return (
    <Collapsible defaultOpen={false}>
      <CollapsibleTrigger className="group flex w-full items-center rounded-md text-sm font-medium outline-none ring-ring transition-all hover:bg-accent hover:text-accent-foreground focus-visible:ring-2">
        <div className="flex h-8 min-w-8 flex-1 items-center gap-2 overflow-hidden px-1.5">
          <AtomIcon className="h-4 w-4 shrink-0" />
          <div className="flex flex-1 overflow-hidden">
            <div className="line-clamp-1 pr-6">Similar Posts</div>
          </div>
        </div>
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md transition-all group-data-[state=open]:rotate-90" aria-hidden="true">
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </span>
      </CollapsibleTrigger>

      <CollapsibleContent className="px-4 py-0.5">
        <ul className="grid border-l px-2">
          {similarPosts.map((post) => (
            <li key={post.slug}>
              <Link
                className={cn(
                  "flex overflow-hidden rounded-md px-2 py-1 text-sm font-medium text-muted-foreground ring-ring transition-all hover:text-primary/80 focus-visible:ring-2"
                )}
                href={routes.post(post.slug)}
              >
                <div className="line-clamp-2">{post.title}</div>
              </Link>
            </li>
          ))}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  );
};

export const PostToc = () => {
  const post = useCurrentPost();
  const activeHeading = useActiveHeading({
    headings: post?.headings ?? [],
  });

  if (!post) return null;

  return (
    <Collapsible defaultOpen={true}>
      <CollapsibleTrigger className="group flex w-full items-center rounded-md text-sm font-medium outline-none ring-ring transition-all hover:bg-accent hover:text-accent-foreground focus-visible:ring-2">
        <div className="flex h-8 min-w-8 flex-1 items-center gap-2 overflow-hidden px-1.5">
          <TableOfContents className="h-4 w-4 shrink-0" />
          <div className="flex flex-1 overflow-hidden">
            <div className="line-clamp-1 pr-6">Table of contents</div>
          </div>
        </div>
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md transition-all group-data-[state=open]:rotate-90" aria-hidden="true">
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </span>
      </CollapsibleTrigger>

      <CollapsibleContent className="px-4 py-0.5">
        <ul className="grid border-l">
          {post.headings.map((item) => (
            <li
              key={item.slug}
              className={cn("py-0.5", item.depth === 3 ? "ml-2" : "px-0")}
            >
              <TocItem
                slug={item.slug}
                data-depth={item.depth}
                data-heading-slug={item.slug}
                className={
                  activeHeading === item.slug
                    ? "translate-x-2 font-semibold text-primary transition-all"
                    : ""
                }
              >
                <ArrowRightIcon
                  className={cn(
                    "size-3 shrink-0 transition-transform duration-300",
                    activeHeading === item.slug
                      ? "translate-x-0"
                      : "-translate-x-2 opacity-0"
                  )}
                />
                <div dangerouslySetInnerHTML={{ __html: item.html }} />
              </TocItem>
            </li>
          ))}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  );
};


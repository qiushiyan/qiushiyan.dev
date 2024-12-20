"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRightIcon,
  AtomIcon,
  ChevronRight,
  TableOfContents,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Sidebar, SidebarContent, SidebarItem } from "@/components/ui/sidebar";
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
      <CollapsibleTrigger asChild>
        <div className="group relative flex items-center">
          <div className="flex h-8 min-w-8 flex-1 items-center gap-2 overflow-hidden rounded-md px-1.5 text-sm font-medium outline-none ring-ring transition-all hover:bg-accent hover:text-accent-foreground focus-visible:ring-2">
            <AtomIcon className="h-4 w-4 shrink-0" />
            <div className="flex flex-1 overflow-hidden">
              <div className="line-clamp-1 pr-6">Similar Posts</div>
            </div>
          </div>
          <Button
            variant="ghost"
            className="absolute right-1 h-6 w-6 rounded-md p-0 ring-ring transition-all focus-visible:ring-2 group-data-[state=open]:rotate-90"
          >
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <span className="sr-only">Toggle</span>
          </Button>
        </div>
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
  const [activeHeading, setActiveHeading] = useState<string | null>(null);

  useEffect(() => {
    if (!post) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHeading(entry.target.id);
          }
        });
      },
      { rootMargin: "-40px 0px -80% 0px" }
    );

    post.headings.forEach((heading) => {
      const element = document.getElementById(heading.slug);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [post]);

  if (!post) return null;

  return (
    <Collapsible defaultOpen={true}>
      <CollapsibleTrigger asChild>
        <div className="group relative flex items-center">
          <div className="flex h-8 min-w-8 flex-1 items-center gap-2 overflow-hidden rounded-md px-1.5 text-sm font-medium outline-none ring-ring transition-all hover:bg-accent hover:text-accent-foreground focus-visible:ring-2">
            <TableOfContents className="h-4 w-4 shrink-0" />
            <div className="flex flex-1 overflow-hidden">
              <div className="line-clamp-1 pr-6">Table of contents</div>
            </div>
          </div>
          <Button
            variant="ghost"
            className="absolute right-1 h-6 w-6 rounded-md p-0 ring-ring transition-all focus-visible:ring-2 group-data-[state=open]:rotate-90"
          >
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <span className="sr-only">Toggle</span>
          </Button>
        </div>
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

interface TocItemProps extends React.HTMLAttributes<HTMLAnchorElement> {
  slug: string;
  children: React.ReactNode;
}
export const TocItem = ({
  slug,
  children,
  className,
  ...props
}: TocItemProps) => {
  return (
    <Link
      href={`#${slug}`}
      className={cn(
        "flex min-w-8 items-center gap-2 overflow-hidden rounded-md px-2 py-1 text-sm font-medium text-muted-foreground ring-ring transition-all hover:text-primary/80 focus-visible:ring-2",
        className
      )}
      {...props}
    >
      {children}
    </Link>
  );
};

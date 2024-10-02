"use client";

import { useActiveHeading } from "@/hooks/use-active-heading";
import { cn } from "@/lib/utils";
import { Post } from "#content";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

export const PostToc = ({ headings }: { headings: Post["headings"] }) => {
  const activeHeading = useActiveHeading({ headings });

  return (
    <ul className="grid list-none px-2">
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
              activeHeading === item.slug
                ? "translate-x-2 font-semibold text-primary transition-all"
                : ""
            }
          >
            {activeHeading === item.slug && (
              <ArrowRightIcon className="size-3 shrink-0" />
            )}
            <span dangerouslySetInnerHTML={{ __html: item.html }} />
          </TocItem>
        </li>
      ))}
    </ul>
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
        "flex items-center gap-2 overflow-hidden rounded-md px-2 py-1 text-base font-medium text-muted-foreground ring-ring transition-all hover:text-primary/80 focus-visible:ring-2",
        className
      )}
      {...props}
    >
      {children}
    </Link>
  );
};

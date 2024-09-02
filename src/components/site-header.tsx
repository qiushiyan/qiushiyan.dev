import React from "react";

import { getPosts } from "@/lib/content/posts";
import { routes } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { Link } from "next-view-transitions";

import { SiteSearch } from "./site-search";
import { ThemeToggle } from "./theme-toggle";

interface SiteHeaderProps extends React.ComponentProps<"div"> {
  renderRight?: () => React.ReactNode;
}

const searchData = getPosts().map((post) => ({
  title: post.title,
  description: post.description,
  href: post.href,
  raw: post.raw,
}));
export type SearchData = (typeof searchData)[number];

export const SiteHeader = ({
  className,
  renderRight,
  ...props
}: SiteHeaderProps) => {
  return (
    <header
      className={cn("sticky top-0 z-40 w-full bg-background py-4", className)}
      {...props}
    >
      <div className="container flex h-[var(--nav-height)] items-center space-x-4 sm:justify-between sm:space-x-2">
        <Link
          href={routes.home}
          className="font-heading text-2xl font-extrabold tracking-wide"
        >
          qiushiyan.dev
        </Link>

        <div className="ml-auto flex items-center justify-end space-x-4">
          <SiteSearch data={searchData} />
          {renderRight?.()}
          <Link
            href={routes.about}
            style={{ viewTransitionName: "about" }}
            className="hidden font-heading text-lg !text-foreground"
          >
            About
          </Link>
          <nav className="flex items-center space-x-1">
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
};

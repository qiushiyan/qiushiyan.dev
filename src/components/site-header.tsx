import React from "react";

import { MAIN_CONTENT_ID } from "@/constants";
import { getPosts } from "@/lib/content/posts";
import { routes } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { SiGithub } from "@icons-pack/react-simple-icons";
import { recipes } from "#content";
import { Link } from "next-view-transitions";

import { SiteSearch } from "./site-search";
import { SkipLink } from "./skip-link";
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

const firstRecipe = recipes[0];

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
      <SkipLink />
      <div className="container flex h-[var(--nav-height)] items-center space-x-4 sm:justify-between sm:space-x-2">
        <div className="flex items-center gap-4">
          <Link
            href={routes.home}
            className="font-heading text-2xl font-extrabold tracking-wide text-primary hover:underline hover:underline-offset-8"
          >
            qiushiyan.dev
          </Link>
          <Link
            href={"https://github.com/qiushiyan"}
            className="transition-all hover:text-primary/80"
          >
            <SiGithub className="size-6" />
            <span className="sr-only">GitHub</span>
          </Link>
        </div>

        <div className="ml-auto flex items-center justify-end gap-4">
          <Link
            href={routes.recipe(firstRecipe.lang, firstRecipe.slug)}
            style={{ viewTransitionName: "recipes" }}
            className="font-serif text-lg transition-all hover:text-primary/80"
          >
            Recipes
          </Link>
          <SiteSearch data={searchData} />
          {renderRight?.()}
          <Link
            href={routes.about}
            style={{ viewTransitionName: "about" }}
            className="hidden text-lg transition-all hover:text-primary/80"
          >
            About
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

import React from "react";

import { cn } from "@/lib/utils";
import { Link } from "next-view-transitions";

import { SiteSearch } from "./site-search";
import { ThemeToggle } from "./theme-toggle";

interface SiteHeaderProps extends React.ComponentProps<"div"> {
  renderRight?: () => React.ReactNode;
}
const data = {
  searchResults: [
    {
      title: "Routing Fundamentals",
      teaser:
        "The skeleton of every application is routing. This page will introduce you to the fundamental concepts of routing for the web and how to handle routing in Next.js.",
      url: "#",
    },
    {
      title: "Layouts and Templates",
      teaser:
        "The special files layout.js and template.js allow you to create UI that is shared between routes. This page will guide you through how and when to use these special files.",
      url: "#",
    },
    {
      title: "Data Fetching, Caching, and Revalidating",
      teaser:
        "Data fetching is a core part of any application. This page goes through how you can fetch, cache, and revalidate data in React and Next.js.",
      url: "#",
    },
    {
      title: "Server and Client Composition Patterns",
      teaser:
        "When building React applications, you will need to consider what parts of your application should be rendered on the server or the client. ",
      url: "#",
    },
    {
      title: "Server Actions and Mutations",
      teaser:
        "Server Actions are asynchronous functions that are executed on the server. They can be used in Server and Client Components to handle form submissions and data mutations in Next.js applications.",
      url: "#",
    },
  ],
};

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
          href="/"
          className="font-heading text-2xl font-extrabold tracking-wide"
        >
          qiushiyan.dev
        </Link>

        <div className="ml-auto flex items-center justify-end space-x-4">
          <SiteSearch results={data.searchResults} />
          {renderRight?.()}
          <Link
            href={"/about"}
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

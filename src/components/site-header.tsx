import { Link } from "next-view-transitions";

import { ThemeToggle } from "./theme-toggle";

export const SiteHeader = () => {
  return (
    <header className="sticky top-0 z-40 w-full bg-background py-4">
      <div className="container flex h-[var(--nav-height)] items-center space-x-4 sm:justify-between sm:space-x-0">
        <Link
          href="/"
          className="font-heading text-2xl font-extrabold tracking-wide"
        >
          qiushiyan.dev
        </Link>

        <div className="flex flex-1 items-center justify-end space-x-4">
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

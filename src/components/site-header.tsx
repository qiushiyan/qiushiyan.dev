import { Link } from "next-view-transitions";

import { ThemeToggle } from "./theme-toggle";

export const SiteHeader = () => {
  return (
    <header className="sticky top-0 z-40 w-full bg-background py-4">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <h2 className="text-2xl font-extrabold tracking-wide">
          <Link
            href="/"
            className="no-underline underline-offset-2 hover:underline"
          >
            qiushiyan.dev
          </Link>
        </h2>

        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
};

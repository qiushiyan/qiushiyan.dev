import Link from "next/link";

import { Container } from "@/components/container";
import { SiteSearch } from "@/components/site-search";
import { SkipLink } from "@/components/skip-link";
import { ThemeToggle } from "@/components/theme-toggle";
import { navLinks, routes } from "@/lib/navigation";
import { MobileNav } from "./mobile-nav";
import { NavLink } from "./nav-link";
import type { SearchEntry } from "@/lib/content/search";

/**
 * The nav bar markup. Server pages render `SiteNav`, which supplies the search
 * index; client boundaries (error.tsx) render this directly, without search.
 */
export function SiteNavBar({
  searchEntries,
  additionalControls,
}: {
  searchEntries?: SearchEntry[];
  additionalControls?: React.ReactNode;
}) {
  return (
    <header className="sticky top-0 z-40 h-(--nav-height) shrink-0 border-b border-border bg-background">
      <SkipLink />
      <Container className="flex h-full items-center gap-6">
        <Link
          href={routes.home}
          className="rounded-md py-2 text-base font-semibold tracking-tight"
        >
          qiushiyan.dev
        </Link>
        <nav aria-label="Main" className="ml-auto hidden items-center md:flex">
          {navLinks.map((link) => (
            <NavLink key={link.href} href={link.href}>
              {link.label}
            </NavLink>
          ))}
        </nav>
        {/* The negative margin lines the last icon's glyph up with the container edge. */}
        <div className="-mr-2.5 flex items-center max-md:ml-auto">
          {additionalControls}
          {searchEntries && <SiteSearch entries={searchEntries} />}
          <ThemeToggle />
          <MobileNav />
        </div>
      </Container>
    </header>
  );
}

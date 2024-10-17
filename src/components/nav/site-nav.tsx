import { routes } from "@/lib/navigation";
import { SiGithub } from "@icons-pack/react-simple-icons";
import Link from "next/link";

import { NavLinks } from "../config";
import { Container } from "../container";
import SiteSearch from "../site-search";
import { ThemeToggle } from "../theme-toggle";
import { MobileNav } from "./mobile-nav";
import { PlusGrid, PlusGridItem, PlusGridRow } from "./plus-grid";

export function SiteNav({
  banner,
  additionalControls,
}: {
  banner?: React.ReactNode;
  additionalControls?: React.ReactNode;
}) {
  return (
    <Container className="sticky top-0 z-40 overflow-x-hidden bg-background">
      <header>
        <PlusGrid>
          <PlusGridRow className="relative flex justify-between">
            <div className="relative flex gap-6">
              <PlusGridItem className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <Link
                    href={routes.home}
                    className="text-2xl font-extrabold tracking-wide transition-all hover:text-primary"
                    title="Home"
                  >
                    qiushiyan.dev
                  </Link>
                </div>
              </PlusGridItem>
              {banner && (
                <div className="relative hidden items-center py-3 lg:flex">
                  {banner}
                </div>
              )}
            </div>
            <DesktopNav additionalControls={additionalControls} />
            <PlusGridItem className="px-4 py-3 lg:hidden">
              <MobileNav />
            </PlusGridItem>
          </PlusGridRow>
        </PlusGrid>
      </header>
    </Container>
  );
}

function DesktopNav({
  additionalControls,
}: {
  additionalControls?: React.ReactNode;
}) {
  return (
    <nav className="relative hidden lg:flex">
      {NavLinks.Main.map(({ href, label, viewTransitionName }) => (
        <PlusGridItem
          key={href}
          className="relative flex transition-colors hover:bg-muted"
        >
          <Link
            href={href}
            className="flex items-center px-4 py-3 text-base font-medium text-accent-foreground bg-blend-multiply"
            title={label}
            style={{
              viewTransitionName,
            }}
          >
            {label}
          </Link>
        </PlusGridItem>
      ))}
      <PlusGridItem className="relative flex px-4 py-3">
        <div className="flex items-center gap-4">
          {additionalControls}
          <SiteSearch />
          <ThemeToggle />
        </div>
      </PlusGridItem>
    </nav>
  );
}

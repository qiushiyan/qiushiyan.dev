import { searchData } from "@/lib/content/posts";
import { routes } from "@/lib/navigation";
import { SiGithub } from "@icons-pack/react-simple-icons";
import Link from "next/link";

import { NavLinks } from "../config";
import { Container } from "../container";
import SiteSearch from "../site-search";
import { ThemeToggle } from "../theme-toggle";
import { MobileNav } from "./mobile-nav";
import { PlusGrid, PlusGridItem, PlusGridRow } from "./plus-grid";

function DesktopNav({
  additionalControls,
}: {
  additionalControls?: React.ReactNode;
}) {
  return (
    <nav className="relative hidden lg:flex">
      {NavLinks.Main.map(({ href, label, viewTransitionName }) => (
        <PlusGridItem key={href} className="relative flex">
          <Link
            href={href}
            className="flex items-center px-4 py-3 text-base font-medium text-gray-950 bg-blend-multiply data-[hover]:bg-black/[2.5%]"
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
                    className="font-heading text-2xl font-extrabold tracking-wide text-primary/80 transition-all hover:text-primary"
                    title="Home"
                  >
                    qiushiyan.dev
                  </Link>
                  <Link
                    href={"https://github.com/qiushiyan"}
                    className="transition-all hover:text-primary/80"
                    title="GitHub"
                  >
                    <SiGithub className="size-6" />
                    <span className="sr-only">GitHub</span>
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
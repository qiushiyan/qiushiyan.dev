import { SiteNav } from "@/components/nav/site-nav";
import { PageMain } from "@/components/page-layout";

/** The nav plus the shared index-page column. */
export function PageShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <>
      <SiteNav />
      <PageMain className={className}>{children}</PageMain>
    </>
  );
}

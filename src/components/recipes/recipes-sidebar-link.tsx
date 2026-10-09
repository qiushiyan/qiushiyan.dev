"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useSidebar } from "@/components/ui/sidebar";
import { routes } from "@/lib/navigation";

export function RecipesSidebarLink({
  title,
  slug,
  group,
}: {
  title: string;
  slug: string;
  group: string;
}) {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();
  const href = routes.recipe(group, slug);

  return (
    <Link
      href={href}
      onClick={() => setOpenMobile(false)}
      aria-current={pathname === href ? "page" : undefined}
      className="block rounded-md px-2 py-1.5 text-sm text-muted-foreground -outline-offset-2 transition-colors hover:bg-muted hover:text-foreground aria-[current=page]:bg-muted aria-[current=page]:text-foreground"
    >
      {title}
    </Link>
  );
}

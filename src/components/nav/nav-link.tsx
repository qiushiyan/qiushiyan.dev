"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { isActivePath } from "@/lib/navigation";

export function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <Link
      href={href}
      aria-current={isActivePath(pathname, href) ? "page" : undefined}
      className="inline-flex h-10 items-center rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground aria-[current=page]:text-foreground"
    >
      {children}
    </Link>
  );
}

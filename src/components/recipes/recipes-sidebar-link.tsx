"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileCodeIcon } from "lucide-react";

import { routes } from "@/lib/navigation";
import { cn } from "@/lib/utils";

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
  const pathSlug = pathname.split("/").pop();

  const isActive = pathSlug === slug;

  return (
    <Link
      href={routes.recipe(group, slug)}
      className={cn(
        "flex items-start gap-2 p-2",
        isActive && "bg-accent text-accent-foreground"
      )}
    >
      <FileCodeIcon className="mt-1 size-4 shrink-0" />
      <span>{title}</span>
    </Link>
  );
}

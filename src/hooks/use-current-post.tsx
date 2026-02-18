"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { posts } from "#content";

import type { Post } from "#content";

export const useCurrentPost = (): Post | undefined => {
  const pathname = usePathname();
  return useMemo(() => {
    if (!pathname.startsWith("/posts/")) return undefined;
    const slug = pathname.split("/posts/")[1];
    return posts.find((p) => p.slug === slug);
  }, [pathname]);
};

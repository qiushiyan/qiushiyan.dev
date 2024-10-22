"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { posts } from "#content";

import type { Post } from "#content";

export const useCurrentPost = () => {
  const [post, setPost] = useState<Post | undefined>(undefined);
  const pathname = usePathname();
  useEffect(() => {
    if (pathname.startsWith("/posts")) {
      const slug = pathname.split("/posts/")[1];
      const post = posts.find((p) => p.slug === slug);
      setPost(post);
    } else {
      setPost(undefined);
    }
  }, [pathname]);

  return post;
};

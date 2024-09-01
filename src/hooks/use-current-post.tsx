"use client";

import { useEffect, useState } from "react";

import { findPost } from "@/lib/content/posts";
import { Post } from "#content";
import { usePathname } from "next/navigation";

export const useCurrentPost = () => {
  const [post, setPost] = useState<Post | undefined>(undefined);
  const pathname = usePathname();
  useEffect(() => {
    if (pathname.startsWith("/posts")) {
      const slug = pathname.split("/posts/")[1];
      const post = findPost(slug);
      setPost(post);
    } else {
      setPost(undefined);
    }
  }, [pathname]);

  return post;
};

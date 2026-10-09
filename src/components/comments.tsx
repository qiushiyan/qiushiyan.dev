"use client";

import Giscus from "@giscus/react";
import { useTheme } from "next-themes";

/*
  GitHub Discussions comments. Discussions are matched to posts by the
  `og:title` meta tag, so a post's Open Graph title must stay the post title
  or its existing discussion detaches.
*/
export function Comments() {
  // `theme` is "system" until the reader toggles; the resolved value follows the OS.
  const { resolvedTheme } = useTheme();
  return (
    <Giscus
      id="comments"
      repo="qiushiyan/qiushiyan.dev"
      repoId="R_kgDOMqSWvg"
      category="General"
      categoryId="DIC_kwDOMqSWvs4CiDwZ"
      mapping="og:title"
      reactionsEnabled="1"
      inputPosition="top"
      theme={resolvedTheme === "dark" ? "transparent_dark" : "light"}
      lang="en"
      loading="lazy"
    />
  );
}

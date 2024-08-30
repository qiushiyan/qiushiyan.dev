"use client";

import React from "react";

import Giscus from "@giscus/react";
import { useTheme } from "next-themes";

export default function Comments() {
  const { theme } = useTheme();
  return (
    <Giscus
      id="comments"
      repo="qiushiyan/qiushiyan.dev"
      repoId="R_kgDOMqSWvg"
      category="General"
      categoryId="DIC_kwDOMqSWvs4CiDwZ"
      mapping={"og:title"}
      term="Welcome to @giscus/react component!"
      reactionsEnabled="1"
      inputPosition="top"
      theme={theme === "dark" ? "dark" : "light"}
      lang="en"
      loading="lazy"
    />
  );
}

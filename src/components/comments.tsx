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
      repoId="MDEwOlJlcG9zaXRvcnkyMjMxNzYwNDg="
      category="General"
      categoryId="MDE4OkRpc2N1c3Npb25DYXRlZ29yeTMyMDM5MDI3"
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

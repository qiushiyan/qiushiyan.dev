import { cache } from "react";

import { isProduction } from "@/constants";
import { posts } from "#content";

export const getPosts = cache(() => {
  const allPosts = isProduction ? posts.filter((post) => !post.draft) : posts;
  return [...allPosts].sort((postA, postB) =>
    postB.date.localeCompare(postA.date)
  );
});

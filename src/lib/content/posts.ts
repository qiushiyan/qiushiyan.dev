import { cache } from "react";
import { posts } from "#content";

import { isProduction } from "@/constants";

export const getPosts = cache(() => {
  const allPosts = isProduction ? posts.filter((post) => !post.draft) : posts;
  return [...allPosts].sort((postA, postB) =>
    postB.date.localeCompare(postA.date)
  );
});

export const getPostsByTags = cache((tags: string[]) => {
  return getPosts().filter((post) =>
    tags.some((tag) => post.tags.includes(tag))
  );
});

export const findPost = (slug: string) => {
  return posts.find((post) => post.slug === slug);
};

export const getAllTags = cache(() => {
  const posts = getPosts();
  const tags = posts.reduce((acc, post) => {
    post.tags.forEach((tag) => {
      acc.set(tag, true);
    });
    return acc;
  }, new Map<string, boolean>());
  return Array.from(tags.keys());
});

export const searchData = getPosts().map((post) => ({
  title: post.title,
  description: post.description,
  href: post.href,
}));

export type SearchData = (typeof searchData)[number];

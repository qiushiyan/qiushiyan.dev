import "server-only";

import { posts } from "#content";

import { byDateDesc, isPublished } from "./collection";
import type { Post } from "#content";

// Velite output is static, so the published list is computed once.
const publishedPosts = posts.filter(isPublished).sort(byDateDesc);

/** Published posts, newest first. */
export const getPosts = () => publishedPosts;

export const getPost = (slug: string) =>
  publishedPosts.find((post) => post.slug === slug);

export const getAllTags = () => [
  ...new Set(publishedPosts.flatMap((post) => post.tags)),
];

/** Other posts that share at least one tag with `post`, newest first. */
export const getRelatedPosts = (post: Post, limit = 3) =>
  publishedPosts
    .filter(
      (other) =>
        other.slug !== post.slug &&
        other.tags.some((tag) => post.tags.includes(tag))
    )
    .slice(0, limit);

/** The neighbours of `slug` in date order. */
export const getAdjacentPosts = (slug: string) => {
  const index = publishedPosts.findIndex((post) => post.slug === slug);
  return {
    older: index === -1 ? undefined : publishedPosts[index + 1],
    newer: index > 0 ? publishedPosts[index - 1] : undefined,
  };
};

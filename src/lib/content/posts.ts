import { getCollection } from "astro:content";

import type { CollectionEntry } from "astro:content";

export type Post = CollectionEntry<"posts">;

/** Published posts, newest first. Drafts show in development only. */
export const getPosts = async () =>
  (await getCollection("posts", (post) => import.meta.env.DEV || !post.data.draft)).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf()
  );

export const getAllTags = (posts: Post[]) => [
  ...new Set(posts.flatMap((post) => post.data.tags)),
];

/** Other posts that share at least one tag with `post`, newest first. */
export const getRelatedPosts = (posts: Post[], post: Post, limit = 3) =>
  posts
    .filter(
      (other) =>
        other.id !== post.id &&
        other.data.tags.some((tag) => post.data.tags.includes(tag))
    )
    .slice(0, limit);

/** The neighbours of `post` in date order. */
export const getAdjacentPosts = (posts: Post[], post: Post) => {
  const index = posts.findIndex((other) => other.id === post.id);
  return {
    older: index === -1 ? undefined : posts[index + 1],
    newer: index > 0 ? posts[index - 1] : undefined,
  };
};

/** URL form of a post tag: "Machine Learning" → "machine-learning". */
export const tagSlug = (tag: string) =>
  tag.toLowerCase().replace(/[^a-z0-9]+/g, "-");

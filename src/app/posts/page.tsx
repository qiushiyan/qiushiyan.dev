import { Suspense } from "react";

import { PageHeader } from "@/components/page-layout";
import { PageShell } from "@/components/page-shell";
import { PostListItem } from "@/components/post/post-list";
import {
  PostTagFilter,
  PostTagFilterView,
} from "@/components/post/post-tag-filter";
import { getAllTags, getPosts } from "@/lib/content/posts";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Posts",
  openGraph: { type: "website", title: "Posts" },
};

export default function PostsPage() {
  const tags = getAllTags().toSorted((a, b) => a.localeCompare(b));
  const posts = getPosts().map((post) => ({
    slug: post.slug,
    tags: post.tags,
    row: <PostListItem post={post} />,
  }));

  return (
    <PageShell>
      <PageHeader title="Posts" />
      {/* useSearchParams needs a Suspense boundary on a static page; the fallback is the unfiltered list. */}
      <Suspense fallback={<PostTagFilterView tags={tags} posts={posts} />}>
        <PostTagFilter tags={tags} posts={posts} />
      </Suspense>
    </PageShell>
  );
}

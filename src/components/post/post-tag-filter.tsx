"use client";

import { Fragment } from "react";
import { useSearchParams } from "next/navigation";

import { routes } from "@/lib/navigation";
import { tagSlug } from "@/lib/utils";

export type FilterablePost = {
  slug: string;
  tags: string[];
  /** The server-rendered list row. */
  row: React.ReactNode;
};

type Props = {
  tags: string[];
  posts: FilterablePost[];
};

const tagHref = (tag: string | null) =>
  tag ? `${routes.posts}?tag=${tagSlug(tag)}` : routes.posts;

/**
 * Filters the post list by `?tag=` on the client, so /posts stays a static
 * page. Render it inside <Suspense> with `PostTagFilterView` (no active tag)
 * as the fallback: that keeps the full list in the prerendered HTML.
 */
export function PostTagFilter({ tags, posts }: Props) {
  const searchParams = useSearchParams();
  const param = searchParams.get("tag");
  const active = tags.find((tag) => tagSlug(tag) === param) ?? null;

  return (
    <PostTagFilterView
      tags={tags}
      posts={posts}
      active={active}
      onSelect={(tag) => {
        // Next keeps useSearchParams in sync with the History API, so this
        // re-renders the filter without a server round trip.
        window.history.replaceState(null, "", tagHref(tag));
      }}
    />
  );
}

export function PostTagFilterView({
  tags,
  posts,
  active = null,
  onSelect,
}: Props & {
  active?: string | null;
  onSelect?: (tag: string | null) => void;
}) {
  const visible = active
    ? posts.filter((post) => post.tags.includes(active))
    : posts;

  return (
    <>
      <nav aria-label="Filter by tag" className="mt-6 -ml-2.5 flex flex-wrap">
        {[null, ...tags].map((tag) => (
          <a
            key={tag ?? "all"}
            href={tagHref(tag)}
            aria-current={tag === active ? "page" : undefined}
            onClick={(event) => {
              if (!onSelect || isModifiedClick(event)) return;
              event.preventDefault();
              onSelect(tag);
            }}
            className="inline-flex h-10 items-center rounded-md px-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground aria-[current=page]:text-foreground aria-[current=page]:underline aria-[current=page]:underline-offset-4"
          >
            {tag ?? "All"}
          </a>
        ))}
      </nav>
      {onSelect && (
        <p aria-live="polite" className="sr-only">
          {active
            ? `${visible.length} ${visible.length === 1 ? "post" : "posts"} tagged ${active}`
            : `All ${posts.length} posts`}
        </p>
      )}
      <ol className="mt-6 divide-y divide-border">
        {visible.map((post) => (
          <Fragment key={post.slug}>{post.row}</Fragment>
        ))}
      </ol>
    </>
  );
}

const isModifiedClick = (event: React.MouseEvent) =>
  event.button !== 0 ||
  event.metaKey ||
  event.ctrlKey ||
  event.shiftKey ||
  event.altKey;

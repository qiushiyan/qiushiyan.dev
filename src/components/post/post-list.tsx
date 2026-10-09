import htmr from "htmr";
import { Link } from "next-view-transitions";

import { InlineCode } from "@/components/codehike/inline-code";
import { formatDate } from "@/lib/format";
import { cn, postViewTransitionName } from "@/lib/utils";
import type { Post } from "#content";
import type { ComponentType } from "react";

// Descriptions are one paragraph; inline code is the only custom element they contain.
const descriptionTransform = {
  "code-inline": InlineCode as ComponentType<unknown>,
};

export function PostList({
  posts,
  headingLevel,
  className,
}: {
  posts: Post[];
  headingLevel?: 2 | 3;
  className?: string;
}) {
  return (
    <ol className={cn("divide-y divide-border", className)}>
      {posts.map((post) => (
        <PostListItem key={post.slug} post={post} headingLevel={headingLevel} />
      ))}
    </ol>
  );
}

/** One post row: only the title is a link, stretched over the whole row. */
export function PostListItem({
  post,
  headingLevel = 2,
}: {
  post: Post;
  headingLevel?: 2 | 3;
}) {
  const Heading = headingLevel === 2 ? "h2" : "h3";

  return (
    <li className="group relative py-5 first:pt-0">
      <Heading
        className="text-base/6 font-medium text-balance"
        style={{ viewTransitionName: postViewTransitionName(post.slug) }}
      >
        <Link
          href={post.href}
          className="transition-colors group-hover:text-primary after:absolute after:inset-0"
        >
          {post.title}
        </Link>
      </Heading>
      <div className="mt-1 line-clamp-2 text-sm/6 text-pretty text-muted-foreground [&_code]:text-[0.875em]">
        {htmr(post.descriptionHtml, { transform: descriptionTransform })}
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        <time dateTime={post.date} className="tabular-nums">
          {formatDate(post.date)}
        </time>
        {post.tags.length > 0 && (
          <>
            <span aria-hidden> · </span>
            {post.tags.join(", ")}
          </>
        )}
        {post.draft && (
          <span className="ml-2 font-medium text-foreground">Draft</span>
        )}
      </p>
    </li>
  );
}

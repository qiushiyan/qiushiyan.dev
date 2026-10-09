import { Link } from "next-view-transitions";

import { formatDate } from "@/lib/format";
import type { Post } from "#content";

/** Up to three posts that share a tag with this one. */
export function RelatedPosts({ posts }: { posts: Post[] }) {
  if (posts.length === 0) return null;
  return (
    <section aria-labelledby="related-posts">
      <h2
        id="related-posts"
        className="text-sm font-medium text-muted-foreground"
      >
        Related posts
      </h2>
      <ul className="mt-3 grid gap-3">
        {posts.map((post) => (
          <li
            key={post.slug}
            className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
          >
            <Link
              href={post.href}
              className="font-medium text-pretty underline decoration-current/0 underline-offset-[3px] transition-[text-decoration-color] duration-150 hover:decoration-current/40"
            >
              {post.title}
            </Link>
            <time
              dateTime={post.date}
              className="shrink-0 text-sm text-muted-foreground tabular-nums"
            >
              {formatDate(post.date)}
            </time>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Links to the previous (older) and next (newer) post by date. */
export function PostPager({ older, newer }: { older?: Post; newer?: Post }) {
  if (!older && !newer) return null;
  return (
    <nav aria-label="More posts" className="grid gap-2 sm:grid-cols-2">
      {older && (
        <Link
          href={older.href}
          className="-mx-3 rounded-md px-3 py-3 transition-colors duration-150 hover:bg-muted"
        >
          <span className="block text-sm text-muted-foreground">Previous</span>
          <span className="mt-1 block font-medium text-pretty">
            {older.title}
          </span>
        </Link>
      )}
      {newer && (
        <Link
          href={newer.href}
          className="-mx-3 rounded-md px-3 py-3 transition-colors duration-150 hover:bg-muted sm:col-start-2 sm:text-right"
        >
          <span className="block text-sm text-muted-foreground">Next</span>
          <span className="mt-1 block font-medium text-pretty">
            {newer.title}
          </span>
        </Link>
      )}
    </nav>
  );
}

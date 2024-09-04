import Comments from "@/components/comments";
import { MarkdownSharedComponents } from "@/components/markdown-shared-components";
import { ArticleProse } from "@/components/prose-wrapper";
import { Separator } from "@/components/ui/separator";
import { cn, postViewTransitionName } from "@/lib/utils";

import "./page.scss";

import { Suspense } from "react";

import { incrementView } from "@/actions/views";
import { PostDescription } from "@/components/post/post-description";
import { PostViews } from "@/components/post/post-views";
import { Badge } from "@/components/ui/badge";
import { findPost } from "@/lib/content/posts";
import { routes } from "@/lib/navigation";
import { Post, posts } from "#content";
import htmr from "htmr";
import { ClockIcon } from "lucide-react";
import { Link } from "next-view-transitions";
import { notFound } from "next/navigation";

export default async function PostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = findPost(params.slug);
  if (!post) {
    return notFound();
  }

  incrementView(post.slug);

  return (
    <main className="overflow-x-hidden">
      <ArticleProse>
        <article className="post">
          <PostBanner post={post} />
          <Separator className="full-width" />
          {htmr(post.content, {
            // @ts-ignore
            transform: MarkdownSharedComponents,
          })}
          <Comments />
        </article>
      </ArticleProse>
    </main>
  );
}

const PostBanner = ({ post }: { post: Post }) => {
  return (
    <header className="py-4 lg:py-8">
      <div className="flex items-center justify-between">
        <h1
          className={cn("text-balance text-4xl font-extrabold tracking-wide")}
          style={{
            viewTransitionName: postViewTransitionName(post.slug),
          }}
          id="post-banner"
        >
          {post.title}
        </h1>
        {post.draft && <Badge>Draft</Badge>}
      </div>
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-1 border-l-2 pl-2">
          <time dateTime={post.date} className="font-semibold">
            Published on {new Date(post.date).toLocaleDateString()}
          </time>
          {post.lastModified && (
            <>
              <span className="text-muted-foreground">&middot;</span>
              <time dateTime={post.lastModified}>
                Updated on {new Date(post.lastModified).toLocaleDateString()}
              </time>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          <ClockIcon className="size-4" />
          <p>{post.metadata.readingTime} min read</p>
        </div>
      </div>

      <div className="flex flex-nowrap gap-6">
        <PostDescription
          className="mb-4 flex-grow text-sm lg:text-base"
          description={post.descriptionHtml}
        />

        <Suspense fallback={<PostViews.Skeleton />}>
          <PostViews
            className="my-0 flex-shrink-0 whitespace-nowrap text-sm lg:text-base"
            slug={post.slug}
          />
        </Suspense>
      </div>

      <div className="flex items-center gap-4">
        <Link href={routes.home}>Home</Link>
        <span className="text-xl">&gt;</span>
        <Link href={routes.posts}>Posts</Link>
      </div>
    </header>
  );
};

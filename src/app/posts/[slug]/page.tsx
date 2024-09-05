import Comments from "@/components/comments";
import { MarkdownSharedComponents } from "@/components/markdown-shared-components";
import { ArticleProse } from "@/components/prose-wrapper";
import { Separator } from "@/components/ui/separator";
import { cn, postViewTransitionName } from "@/lib/utils";

import "./page.scss";

import { incrementView } from "@/actions/views";
import { PostDescription } from "@/components/post/post-description";
import { PostViews } from "@/components/post/post-views";
import { Badge } from "@/components/ui/badge";
import { findPost } from "@/lib/content/posts";
import { Post } from "#content";
import htmr from "htmr";
import { CalendarIcon, ClockIcon, EyeIcon } from "lucide-react";
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
    <header className="grid gap-2 py-6">
      <h1
        className={cn(
          "mb-4 text-balance text-4xl font-extrabold tracking-wide"
        )}
        style={{
          viewTransitionName: postViewTransitionName(post.slug),
        }}
        id="post-banner"
      >
        {post.title}
      </h1>
      {post.draft && <Badge>Draft</Badge>}
      <PostDescription
        className="flex-grow text-sm lg:text-base"
        description={post.descriptionHtml}
      />
      <div className="flex flex-wrap items-center space-x-6 text-sm text-muted-foreground">
        <div className="flex items-center">
          <CalendarIcon className="mr-2 h-4 w-4" />
          <time dateTime={post.date}>
            {new Date(post.date).toLocaleDateString()}
          </time>
        </div>
        <div className="flex items-center">
          <ClockIcon className="mr-2 h-4 w-4" />
          <span>{post.metadata.readingTime} min read</span>
        </div>
        <div className="flex items-center">
          <EyeIcon className="mr-2 h-4 w-4" />
          <PostViews slug={post.slug} />
        </div>
      </div>
      {post.lastModified && (
        <div className="flex items-center gap-2">
          <ClockIcon className="size-4" />
          <span className="text-sm text-muted-foreground">
            Last modified: {new Date(post.lastModified).toLocaleDateString()}
          </span>
        </div>
      )}
    </header>
  );
};

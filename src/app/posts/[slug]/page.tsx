import Link from "next/link";
import { notFound } from "next/navigation";
import { after } from "next/server";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { incrementView } from "@/actions/views";
import Comments from "@/components/comments";
import { getComponents } from "@/components/components-registry";
import { HtmlRenderer } from "@/components/html-renderer";
import { PostBanner } from "@/components/post/post-banner";
import { ArticleProse } from "@/components/prose-wrapper";
import { Separator } from "@/components/ui/separator";
import { MAIN_CONTENT_ID } from "@/constants";
import { findPost, getPosts } from "@/lib/content/posts";
import { routes } from "@/lib/navigation";

import "./page.scss";

export default async function PostPage(
  props: {
    params: Promise<{ slug: string }>;
  }
) {
  const params = await props.params;
  const post = findPost(params.slug);
  if (!post) {
    return notFound();
  }

  after(() => incrementView(post.slug));

  return (
    <main className="space-y-8 overflow-x-hidden pb-8">
      <ArticleProse className="prose-h2:my-8 prose-h2:underline prose-h2:underline-offset-8 prose-h3:my-4 prose-p:my-4">
        <div className="mt-6 w-full space-y-6">
          <PostBanner post={post} />
          <Separator />

          <article className="post center-grid m-0!" id={MAIN_CONTENT_ID}>
            <HtmlRenderer
              content={post.content}
              components={await getComponents(post.components)}
            />
          </article>
        </div>
      </ArticleProse>
      <Separator />
      <div className="center-grid space-y-12">
        <Pager slug={post.slug} />
        <Comments />
      </div>
    </main>
  );
}

const Pager = ({ slug }: { slug: string }) => {
  const posts = getPosts();
  const idx = posts.findIndex((post) => post.slug === slug);
  if (idx === -1) {
    return null;
  }
  const prevPost = idx === 0 ? undefined : posts.at(idx - 1);
  const nextPost = idx === posts.length - 1 ? undefined : posts.at(idx + 1);

  return (
    <div className="grid grid-cols-2 gap-8">
      {prevPost && (
        <Link
          className="group flex items-center gap-2 rounded-md px-2 py-3 text-sm text-muted-foreground no-underline transition-all hover:bg-accent lg:text-base"
          href={routes.post(prevPost.slug)}
          aria-label={`Previous post: ${prevPost.title}`}
        >
          <ChevronLeftIcon className="size-6 transition-all group-hover:-translate-x-1" />
          <span>{prevPost.title}</span>
        </Link>
      )}
      {nextPost && (
        <Link
          className="group col-start-2 flex items-center gap-2 rounded-md px-2 py-3 text-right text-sm text-muted-foreground no-underline transition-all hover:bg-accent lg:text-base"
          href={routes.post(nextPost.slug)}
          aria-label={`Next post: ${nextPost.title}`}
        >
          <span>{nextPost.title}</span>
          <ChevronRightIcon className="size-6 transition-all group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );
};

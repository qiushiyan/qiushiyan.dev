import Comments from "@/components/comments";
import { getComponents } from "@/components/components-registry";
import { ArticleProse } from "@/components/prose-wrapper";
import { Separator } from "@/components/ui/separator";

import "./page.scss";

import { incrementView } from "@/actions/views";
import { PostBanner } from "@/components/post/post-banner";
import { MAIN_CONTENT_ID } from "@/constants";
import { findPost } from "@/lib/content/posts";
import htmr from "htmr";
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
    <main className="overflow-x-hidden" id={MAIN_CONTENT_ID}>
      <ArticleProse className="prose-h2:my-8 prose-h2:underline prose-h2:underline-offset-8 prose-h3:my-4 prose-p:my-4">
        <article className="post">
          <PostBanner post={post} />

          <Separator className="full-width" />
          {htmr(post.content, {
            // @ts-ignore
            transform: await getComponents(post.components),
          })}
          <div className="mt-16">
            <Comments />
          </div>
        </article>
      </ArticleProse>
    </main>
  );
}

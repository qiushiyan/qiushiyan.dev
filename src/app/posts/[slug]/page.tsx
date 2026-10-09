import { notFound } from "next/navigation";

import {
  ArticleDate,
  ArticleHeader,
  updatedItem,
} from "@/components/article/article-header";
import { JsonLd } from "@/components/article/json-ld";
import { TocRail } from "@/components/article/toc-rail";
import { Comments } from "@/components/comments";
import { getComponents } from "@/components/components-registry";
import { HtmlRenderer } from "@/components/html-renderer";
import { PostDescription } from "@/components/post/post-description";
import { PostPager, RelatedPosts } from "@/components/post/post-footer";
import { PostViewCount } from "@/components/post/post-view-count";
import { ArticleProse } from "@/components/prose-wrapper";
import { MAIN_CONTENT_ID } from "@/constants";
import {
  getAdjacentPosts,
  getPost,
  getPosts,
  getRelatedPosts,
} from "@/lib/content/posts";
import { markdownToPlainText } from "@/lib/plain-text";
import { siteConfig } from "@/lib/site";
import { postViewTransitionName } from "@/lib/utils";

// Every published post is prerendered; drafts and unknown slugs 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return getPosts().map((post) => ({ slug: post.slug }));
}

export default async function PostPage({ params }: PageProps<"/posts/[slug]">) {
  const post = getPost((await params).slug);
  if (!post) notFound();

  const { older, newer } = getAdjacentPosts(post.slug);
  const url = new URL(post.href, siteConfig.url).href;

  return (
    <main id={MAIN_CONTENT_ID} className="pb-24">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: markdownToPlainText(post.description),
          datePublished: post.date,
          dateModified: post.lastModified ?? post.date,
          url,
          mainEntityOfPage: url,
          keywords: post.tags,
          author: {
            "@type": "Person",
            name: siteConfig.name,
            url: siteConfig.url,
          },
        }}
      />
      <ArticleProse className="article">
        <ArticleHeader
          title={post.title}
          viewTransitionName={postViewTransitionName(post.slug)}
          description={
            <PostDescription
              description={post.descriptionHtml}
              className="text-base/7 text-pretty text-muted-foreground sm:text-lg/8"
            />
          }
          meta={[
            post.draft && (
              <span key="draft" className="font-medium text-foreground">
                Draft
              </span>
            ),
            <ArticleDate key="date" iso={post.date} />,
            <span key="reading">{post.metadata.readingTime} min read</span>,
            updatedItem(post.date, post.lastModified),
          ]}
          trailing={<PostViewCount slug={post.slug} />}
        />
        <div className="relative">
          <TocRail headings={post.headings} />
          <article className="article-column article-body">
            <HtmlRenderer
              content={post.content}
              components={await getComponents(post.components)}
            />
          </article>
        </div>
        <footer className="article-column not-prose mt-16 grid gap-12 border-t pt-10">
          <RelatedPosts posts={getRelatedPosts(post, 3)} />
          <PostPager older={older} newer={newer} />
          <Comments />
        </footer>
      </ArticleProse>
    </main>
  );
}

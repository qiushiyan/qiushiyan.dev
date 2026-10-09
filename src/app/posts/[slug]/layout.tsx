import { notFound } from "next/navigation";

import { TocPopover } from "@/components/article/toc-popover";
import { SiteNav } from "@/components/nav/site-nav";
import { getPost } from "@/lib/content/posts";
import { markdownToPlainText } from "@/lib/plain-text";
import { siteConfig } from "@/lib/site";
import type { Metadata } from "next";

import "@/styles/article.css";

export async function generateMetadata({
  params,
}: LayoutProps<"/posts/[slug]">): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return {};

  const description = markdownToPlainText(post.description);
  return {
    title: post.title,
    description,
    alternates: { canonical: post.href },
    openGraph: {
      type: "article",
      siteName: siteConfig.name,
      // Giscus finds each post's discussion by `og:title`: keep it the bare title.
      title: post.title,
      description,
      url: post.href,
      publishedTime: post.date,
      modifiedTime: post.lastModified,
      authors: [siteConfig.url],
      tags: post.tags,
    },
  };
}

export default async function PostLayout({
  children,
  params,
}: LayoutProps<"/posts/[slug]">) {
  const post = getPost((await params).slug);
  if (!post) notFound();

  return (
    <>
      <SiteNav
        additionalControls={
          <TocPopover headings={post.headings} className="xl:hidden" />
        }
      />
      {children}
    </>
  );
}

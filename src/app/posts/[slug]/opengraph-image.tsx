import { notFound } from "next/navigation";

import { getPost, getPosts } from "@/lib/content/posts";
import { ogImageSize, renderOgImage } from "@/lib/og";
import { markdownToPlainText } from "@/lib/plain-text";
import { siteConfig } from "@/lib/site";

export const alt = `Title card for a post by ${siteConfig.name}`;
export const size = ogImageSize;
export const contentType = "image/png";

// Image routes are route handlers: they don't inherit the page's
// generateStaticParams, so they list the slugs to prerender themselves.
export const dynamicParams = false;
export const generateStaticParams = () =>
  getPosts().map((post) => ({ slug: post.slug }));

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const post = getPost((await params).slug);
  if (!post) notFound();

  return renderOgImage({
    title: post.title,
    description: markdownToPlainText(post.description),
  });
}

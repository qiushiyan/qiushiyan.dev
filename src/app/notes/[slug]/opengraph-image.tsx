import { notFound } from "next/navigation";

import { getNote, getNotes } from "@/lib/content/notes";
import { ogImageSize, renderOgImage } from "@/lib/og";
import { siteConfig } from "@/lib/site";

export const alt = `Title card for a note by ${siteConfig.name}`;
export const size = ogImageSize;
export const contentType = "image/png";

// Image routes are route handlers: they don't inherit the page's
// generateStaticParams, so they list the slugs to prerender themselves.
export const dynamicParams = false;
export const generateStaticParams = () =>
  getNotes().map((note) => ({ slug: note.slug }));

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const note = getNote((await params).slug);
  if (!note) notFound();

  return renderOgImage({
    title: note.title,
    description: `Note · ${note.category}`,
  });
}

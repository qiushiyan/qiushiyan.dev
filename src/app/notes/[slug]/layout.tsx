import { notFound } from "next/navigation";

import { TocPopover } from "@/components/article/toc-popover";
import { SiteNav } from "@/components/nav/site-nav";
import { getNote } from "@/lib/content/notes";
import { siteConfig } from "@/lib/site";
import type { Metadata } from "next";

import "@/styles/article.css";

export async function generateMetadata({
  params,
}: LayoutProps<"/notes/[slug]">): Promise<Metadata> {
  const note = getNote((await params).slug);
  if (!note) return {};

  return {
    title: note.title,
    description: note.description,
    alternates: { canonical: note.href },
    openGraph: {
      type: "article",
      siteName: siteConfig.name,
      title: note.title,
      description: note.description,
      url: note.href,
      publishedTime: note.date,
      modifiedTime: note.lastModified,
    },
  };
}

export default async function NoteLayout({
  children,
  params,
}: LayoutProps<"/notes/[slug]">) {
  const note = getNote((await params).slug);
  if (!note) notFound();

  return (
    <>
      <SiteNav
        additionalControls={
          <TocPopover headings={note.headings} className="xl:hidden" />
        }
      />
      {children}
    </>
  );
}

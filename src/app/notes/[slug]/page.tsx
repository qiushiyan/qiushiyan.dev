import { notFound } from "next/navigation";

import {
  ArticleDate,
  ArticleHeader,
  updatedItem,
} from "@/components/article/article-header";
import { TocRail } from "@/components/article/toc-rail";
import { getComponents } from "@/components/components-registry";
import { HtmlRenderer } from "@/components/html-renderer";
import { ArticleProse } from "@/components/prose-wrapper";
import { MAIN_CONTENT_ID } from "@/constants";
import { getNote, getNotes } from "@/lib/content/notes";
import { noteViewTransitionName } from "@/lib/utils";

// Every published note is prerendered; drafts and unknown slugs 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return getNotes().map((note) => ({ slug: note.slug }));
}

export default async function NotePage({ params }: PageProps<"/notes/[slug]">) {
  const note = getNote((await params).slug);
  if (!note) notFound();

  return (
    <main id={MAIN_CONTENT_ID} className="pb-24">
      <ArticleProse className="article">
        <ArticleHeader
          title={note.title}
          viewTransitionName={noteViewTransitionName(note.slug)}
          meta={[
            note.draft && (
              <span key="draft" className="font-medium text-foreground">
                Draft
              </span>
            ),
            <ArticleDate key="date" iso={note.date} />,
            updatedItem(note.date, note.lastModified),
          ]}
        />
        <div className="relative">
          <TocRail headings={note.headings} />
          <article className="article-column article-body">
            <HtmlRenderer
              content={note.content}
              components={await getComponents(note.components)}
            />
          </article>
        </div>
      </ArticleProse>
    </main>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";

import { getComponents } from "@/components/components-registry";
import { Container } from "@/components/container";
import { HtmlRenderer } from "@/components/html-renderer";
import { ArticleProse, BasicProse } from "@/components/prose-wrapper";
import { MAIN_CONTENT_ID } from "@/constants";
import { findNote } from "@/lib/content/notes";
import { cn, noteViewTransitionName } from "@/lib/utils";

import "./page.scss";

import { ScrollArea } from "@/components/ui/scroll-area";

export default async function Page({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const note = findNote(slug);
  if (!note) {
    return notFound();
  }

  return (
    <main id={MAIN_CONTENT_ID} className="mb-24">
      <Container innerClassName="grid grid-cols-1 lg:grid-cols-[minmax(auto,240px),65ch] ~gap-6/12">
        <aside className="col-span-1">
          <div className="sticky top-[calc(2rem+var(--nav-height))] h-[80vh]">
            <ScrollArea className="h-full">
              <ol className="flex h-full list-none flex-col gap-3 border-l-2 pl-2">
                {note.headings.map((heading) => (
                  <li
                    key={heading.slug}
                    className={cn("~text-xs/base", {
                      "pl-3": heading.depth === 3,
                    })}
                  >
                    <Link
                      href={`#${heading.slug}`}
                      className="text-muted-foreground"
                      dangerouslySetInnerHTML={{ __html: heading.html }}
                    />
                  </li>
                ))}
              </ol>
            </ScrollArea>
          </div>
        </aside>
        <article className="col-span-1">
          <ArticleProse>
            <h1
              className={cn(
                "mb-4 text-balance text-4xl font-extrabold tracking-wide"
              )}
              style={{
                viewTransitionName: noteViewTransitionName(note.slug),
              }}
            >
              {note.title}
            </h1>
            {note.lastModified && (
              <p className="text-sm text-muted-foreground">
                Last updated at{" "}
                <time dateTime={note.lastModified}>
                  {new Date(note.lastModified).toLocaleDateString()}
                </time>
              </p>
            )}
            <HtmlRenderer
              content={note.content}
              components={await getComponents(note.components)}
            />
          </ArticleProse>
        </article>
      </Container>
    </main>
  );
}

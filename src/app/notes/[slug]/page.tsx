import Link from "next/link";
import { notFound } from "next/navigation";

import { getComponents } from "@/components/components-registry";
import { Container } from "@/components/container";
import { HtmlRenderer } from "@/components/html-renderer";
import { BasicProse } from "@/components/prose-wrapper";
import { MAIN_CONTENT_ID } from "@/constants";
import { findNote } from "@/lib/content/notes";
import { cn, noteViewTransitionName } from "@/lib/utils";

import "./page.scss";

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
    <main id={MAIN_CONTENT_ID}>
      <Container innerClassName="grid grid-cols-[minmax(auto,240px),65ch] gap-8 lg:gap-12">
        <aside className="col-span-1">
          <ol className="sticky top-[calc(2rem+var(--nav-height))] mt-8 flex list-none flex-col gap-3">
            {note.headings.map((heading) => (
              <li
                key={heading.slug}
                className={heading.depth === 3 ? "pl-3 text-sm" : ""}
              >
                <Link
                  href={`#${heading.slug}`}
                  className="text-muted-foreground"
                  dangerouslySetInnerHTML={{ __html: heading.html }}
                />
              </li>
            ))}
          </ol>
        </aside>
        <article className="col-span-1">
          <BasicProse className="mt-8 w-full prose-h2:my-8 prose-h2:underline prose-h2:underline-offset-8 prose-h3:my-4 prose-p:my-4 lg:text-lg lg:leading-loose">
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
          </BasicProse>
        </article>
      </Container>
    </main>
  );
}

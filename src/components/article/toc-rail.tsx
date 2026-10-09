import { ArticleToc } from "./article-toc";
import type { TocHeading } from "./article-toc";

/**
 * The table of contents at 80rem and up, sticky in the empty track left of
 * the text column. Its width comes from the article's em-based measure, so
 * it must not set its own font size (the inner nav does).
 */
export function TocRail({ headings }: { headings: TocHeading[] }) {
  if (headings.length === 0) return null;
  return (
    <div className="not-prose absolute inset-y-0 left-0 hidden w-[calc((100%-var(--measure))/2-3rem)] xl:block">
      <nav
        aria-labelledby="toc-rail-label"
        className="sticky top-[calc(var(--nav-height)+2rem)] ml-auto max-h-[calc(100dvh-var(--nav-height)-4rem)] w-full max-w-56 overflow-y-auto text-sm/6"
      >
        <p id="toc-rail-label" className="mb-3 font-medium text-foreground">
          On this page
        </p>
        <ArticleToc headings={headings} itemClassName="py-1" />
      </nav>
    </div>
  );
}

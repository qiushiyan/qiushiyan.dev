import { Fragment } from "react";

import { formatDate } from "@/lib/format";

/** A date as "Sep 15, 2024", with the ISO value for machines. */
export const ArticleDate = ({ iso }: { iso: string }) => (
  <time dateTime={iso}>{formatDate(iso)}</time>
);

/** "Updated <date>", when the last edit falls on a later day than publication. */
export const updatedItem = (date: string, lastModified?: string) =>
  lastModified && formatDate(lastModified) !== formatDate(date) ? (
    <span>
      Updated <ArticleDate iso={lastModified} />
    </span>
  ) : null;

/**
 * The title block of a post or note: the title, an optional lead, and one
 * muted meta line whose items are separated by middots. `trailing` is
 * appended after the items and supplies its own separator (the view count
 * appears only once it has loaded).
 */
export function ArticleHeader({
  title,
  viewTransitionName,
  description,
  meta,
  trailing,
}: {
  title: string;
  viewTransitionName?: string;
  description?: React.ReactNode;
  meta: React.ReactNode[];
  trailing?: React.ReactNode;
}) {
  const items = meta.filter(Boolean);
  return (
    <header className="article-column not-prose grid gap-4 pt-10 pb-8">
      <h1
        className="text-3xl/tight font-semibold tracking-tight text-balance sm:text-4xl/tight"
        style={{ viewTransitionName }}
      >
        {title}
      </h1>
      {description}
      <p className="flex flex-wrap gap-x-2 text-sm text-muted-foreground">
        {items.map((item, index) => (
          <Fragment key={index}>
            {index > 0 && <span aria-hidden>·</span>}
            {item}
          </Fragment>
        ))}
        {trailing}
      </p>
    </header>
  );
}

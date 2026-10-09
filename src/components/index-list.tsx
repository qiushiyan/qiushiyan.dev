import { Link } from "next-view-transitions";

import { formatDate } from "@/lib/format";
import { tagSlug } from "@/lib/utils";

export type IndexListItem = {
  href: string;
  title: string;
  /** Matches the title's view-transition name on the detail page. */
  viewTransitionName: string;
  date?: string;
};

/** A labelled group of title rows, used by the notes and recipes indexes. */
export function IndexListGroup({
  label,
  items,
}: {
  label: string;
  items: IndexListItem[];
}) {
  const id = `group-${tagSlug(label)}`;

  return (
    <section aria-labelledby={id} className="mt-10 first:mt-8">
      <h2 id={id} className="text-sm font-medium text-muted-foreground">
        {label}
      </h2>
      <ul className="mt-3 divide-y divide-border">
        {items.map((item) => (
          <li
            key={item.href}
            className="group relative flex items-baseline justify-between gap-4 py-3"
          >
            <Link
              href={item.href}
              className="font-medium transition-colors group-hover:text-primary after:absolute after:inset-0"
            >
              <span style={{ viewTransitionName: item.viewTransitionName }}>
                {item.title}
              </span>
            </Link>
            {item.date && (
              <time
                dateTime={item.date}
                className="shrink-0 text-sm text-muted-foreground tabular-nums"
              >
                {formatDate(item.date)}
              </time>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

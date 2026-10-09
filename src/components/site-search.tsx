"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Fuse from "fuse.js";
import { SearchIcon } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { SearchEntry } from "@/lib/content/search";
import type { FuseResultMatch } from "fuse.js";

const MIN_QUERY_LENGTH = 2;
const MAX_SCORE = 0.75;

export function SiteSearch({ entries }: { entries: SearchEntry[] }) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        aria-label="Search"
        className="grid size-10 place-items-center rounded-md text-muted-foreground transition-[color,scale] duration-150 ease-out hover:text-foreground active:scale-[0.96] max-md:size-11"
      >
        <SearchIcon aria-hidden strokeWidth={1.5} className="size-5" />
      </PopoverTrigger>
      <PopoverContent
        align="end"
        collisionPadding={16}
        className="w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-lg p-0"
      >
        <SearchPanel entries={entries} onNavigate={() => setOpen(false)} />
      </PopoverContent>
    </Popover>
  );
}

function SearchPanel({
  entries,
  onNavigate,
}: {
  entries: SearchEntry[];
  onNavigate: () => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const fuse = useMemo(
    () =>
      new Fuse(entries, {
        keys: [{ name: "title", weight: 2 }, "description"],
        includeMatches: true,
        includeScore: true,
        ignoreLocation: true,
        threshold: 0.2,
        minMatchCharLength: MIN_QUERY_LENGTH,
      }),
    [entries]
  );

  const q = query.trim();
  // The index is a few dozen short records, so searching on every keystroke is instant.
  const results = useMemo(
    () =>
      q.length < MIN_QUERY_LENGTH
        ? []
        : fuse
            .search(q, { limit: 8 })
            // A high combined score means a weak fuzzy hit in one field, e.g. "react" in "practical".
            .filter((result) => (result.score ?? 0) < MAX_SCORE),
    [fuse, q]
  );

  return (
    <>
      <form
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          const first = results[0];
          if (first) {
            onNavigate();
            router.push(first.item.href);
          }
        }}
      >
        <input
          type="search"
          autoFocus
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search posts and notes"
          aria-label="Search posts and notes"
          className="h-11 w-full border-b border-border bg-transparent px-3 text-base outline-hidden placeholder:text-muted-foreground md:text-sm"
        />
      </form>
      {q.length >= MIN_QUERY_LENGTH && (
        <div className="max-h-[min(24rem,60dvh)] overflow-y-auto p-1">
          {results.length === 0 ? (
            <p className="px-3 py-2 text-sm text-muted-foreground">
              No results for “{q}”
            </p>
          ) : (
            <ul>
              {results.map(({ item, matches }) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    className="block rounded-sm px-3 py-2 -outline-offset-2 transition-colors hover:bg-muted"
                  >
                    <span className="block text-sm font-medium">
                      <Highlight
                        text={item.title}
                        match={findMatch(matches, "title")}
                      />
                    </span>
                    <span className="mt-0.5 line-clamp-2 block text-sm text-muted-foreground">
                      {item.kind === "note" && "Note · "}
                      <Highlight
                        text={item.description}
                        match={findMatch(matches, "description")}
                      />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </>
  );
}

const findMatch = (
  matches: readonly FuseResultMatch[] | undefined,
  key: string
) => matches?.find((match) => match.key === key);

function Highlight({
  text,
  match,
}: {
  text: string;
  match: FuseResultMatch | undefined;
}) {
  if (!match) return text;

  const parts: React.ReactNode[] = [];
  let cursor = 0;
  for (const [start, end] of match.indices) {
    if (end < cursor) continue;
    if (start > cursor) parts.push(text.slice(cursor, start));
    parts.push(
      <mark key={start} className="rounded-xs bg-primary/15 text-inherit">
        {text.slice(Math.max(start, cursor), end + 1)}
      </mark>
    );
    cursor = end + 1;
  }
  parts.push(text.slice(cursor));

  return parts;
}

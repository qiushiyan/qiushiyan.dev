"use client";

import React, {
  createContext,
  ElementRef,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";

import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useIsMobile } from "@/hooks/use-mobile";
import { searchData, SearchData } from "@/lib/content/posts";
import Fuse, { FuseResultMatch } from "fuse.js";
import { Search } from "lucide-react";
import Link from "next/link";
import { useDebounceValue } from "usehooks-ts";

import { Spinner } from "./ui/spinner";

type SearchResult = {
  title: string;
  matches: FuseResultMatch[];
  href: string;
};

type SearchContextType = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  results: SearchResult[];
  search: (query: string) => void;
  pending: boolean;
};

const SearchContext = createContext<SearchContextType>({} as SearchContextType);
const useSearch = () => useContext(SearchContext);

const SearchProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, _setResults] = useState<SearchResult[]>([]);
  const [pending, startTransition] = useTransition();
  const fuse = useRef<Fuse<SearchData>>();

  const search = useCallback(async (query: string) => {
    const domPurity = (await import("dompurify")).default;
    if (!fuse.current) {
      const Fuse = (await import("fuse.js")).default;
      fuse.current = new Fuse(searchData, {
        keys: [
          { name: "title", weight: 1 },
          { name: "description", weight: 1 },
          { name: "raw", weight: 0.75 },
        ],
        includeMatches: true,
        shouldSort: true,
        minMatchCharLength: 3,
        threshold: 0.5,
      });
    }

    const sanitizedQuery = domPurity.sanitize(query);

    setSearchQuery(sanitizedQuery);
    setResults(
      fuse.current?.search(sanitizedQuery).map((result) => {
        return {
          title: result.item.title,
          matches: result.matches,
          href: result.item.href,
        };
      }) as SearchResult[]
    );
  }, []);

  const setResults = (results: SearchResult[]) => {
    startTransition(() => {
      _setResults(results);
    });
  };

  return (
    <SearchContext.Provider
      value={{ searchQuery, setSearchQuery, search, results, pending }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export function SiteSearch() {
  const isMobile = useIsMobile();

  return (
    <SearchProvider>
      {isMobile ? <SiteSearchMobile /> : <SearchDesktop />}
    </SearchProvider>
  );
}

const SiteSearchMobile: React.FC = () => (
  <Drawer>
    <DrawerTrigger className="transition-all hover:text-primary/80">
      <Search className="size-6 shrink-0" />
    </DrawerTrigger>
    <DrawerContent>
      <SearchForm />
      <SearchResults />
      <SearchFeedback />
    </DrawerContent>
  </Drawer>
);

const SearchDesktop: React.FC = () => (
  <Popover>
    <PopoverTrigger className="transition-all hover:text-primary/80">
      <Search className="size-6 shrink-0" />
    </PopoverTrigger>
    <PopoverContent
      side="bottom"
      align="start"
      sideOffset={4}
      className="w-96 p-0"
    >
      <SearchForm />
      <SearchResults />
      <SearchFeedback />
    </PopoverContent>
  </Popover>
);

const SearchResults: React.FC = () => {
  const { results, pending } = useSearch();

  if (pending) return <Spinner />;

  return (
    <div className="grid gap-1 p-1.5 text-sm">
      {results.map((result) => {
        const contentMatches = result.matches?.find(
          (match) => match.key === "raw"
        );
        const titleMatches = result.matches?.find(
          (match) => match.key === "title"
        );
        const descriptionMatches = result.matches?.find(
          (match) => match.key === "description"
        );

        return (
          <Link
            href={result.href}
            key={result.title}
            className="rounded-md p-2.5 outline-none ring-ring hover:bg-accent hover:text-accent-foreground focus-visible:ring-2"
          >
            <div className="text-base font-medium">
              {titleMatches ? (
                <HighlightedText
                  text={titleMatches.value as string}
                  match={titleMatches}
                />
              ) : (
                result.title
              )}
            </div>
            {descriptionMatches && (
              <HighlightedText
                text={descriptionMatches.value as string}
                match={descriptionMatches}
              />
            )}

            {contentMatches?.value && (
              <p className="text-sm text-muted-foreground">
                <HighlightedText
                  text={contentMatches.value.slice(0, 150) + "..."}
                  match={contentMatches}
                />
              </p>
            )}
          </Link>
        );
      })}
    </div>
  );
};

const SearchFeedback: React.FC = () => {
  const { searchQuery } = useSearch();

  return (
    <>
      <p className="my-1.5 rounded-md px-2.5 py-1 text-sm text-muted-foreground outline-none ring-ring hover:text-foreground focus-visible:ring-2">
        {searchQuery.length < 3
          ? "Search all pages (at least 3 characters)"
          : null}
      </p>
    </>
  );
};

const SearchForm: React.FC = () => {
  const { searchQuery, setSearchQuery, search } = useSearch();
  const formRef = useRef<ElementRef<"form">>(null);

  const [debouncedSearchQuery] = useDebounceValue(searchQuery, 500);
  useEffect(() => {
    if (formRef.current && debouncedSearchQuery.length >= 3) {
      formRef.current.requestSubmit();
    }
  }, [debouncedSearchQuery]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const query = formData.get("search") as string;
    search(query);
  };

  return (
    <form onSubmit={onSubmit} ref={formRef}>
      <div className="border-b p-2.5">
        <Input
          type="search"
          placeholder="Search..."
          className="h-8 rounded-sm shadow-none focus-visible:ring-0"
          name="search"
          minLength={3}
          maxLength={50}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
    </form>
  );
};

const HighlightedText: React.FC<{
  text: string;
  match: FuseResultMatch | undefined;
}> = ({ text, match }) => {
  if (!match) {
    return <span>{text}</span>;
  }

  const parts = match.indices.reduce((acc, [start, end], index) => {
    if (index === 0 && start > 0) {
      acc.push(<span key={`before-${start}`}>{text.slice(0, start)}</span>);
    }

    acc.push(
      <span
        key={`highlight-${start}`}
        className="bg-accent font-bold text-accent-foreground"
      >
        {text.slice(start, end + 1)}
      </span>
    );

    if (index < match.indices.length - 1) {
      const nextStart = match.indices[index + 1][0];
      acc.push(
        <span key={`between-${end}-${nextStart}`}>
          {text.slice(end + 1, nextStart)}
        </span>
      );
    } else if (end < text.length - 1) {
      acc.push(<span key={`after-${end}`}>{text.slice(end + 1)}</span>);
    }

    return acc;
  }, [] as JSX.Element[]);

  return <>{parts}</>;
};

export default SiteSearch;

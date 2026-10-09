"use client";

import { useEffect, useState } from "react";

const formatter = new Intl.NumberFormat("en-US");

/*
  The view count in a post's meta line. The page is static, so the count is
  fetched after load: the first visit in a browser session counts a view
  (POST), later ones only read it (GET). The slot keeps its width while
  loading and on error, so the meta line never shifts.
*/
export function PostViewCount({ slug }: { slug: string }) {
  const [views, setViews] = useState<number>();

  useEffect(() => {
    const key = `viewed:${slug}`;
    let counted = false;
    try {
      counted = sessionStorage.getItem(key) !== null;
      // Set before the request, so a remount (React Strict Mode) can't count twice.
      if (!counted) sessionStorage.setItem(key, "1");
    } catch {
      // Storage unavailable (private mode, blocked): count once per page load.
    }

    const controller = new AbortController();
    fetch(`/api/views/${encodeURIComponent(slug)}`, {
      method: counted ? "GET" : "POST",
      signal: controller.signal,
    })
      .then((response) => (response.ok ? response.json() : undefined))
      .then((data) => {
        const count = (data as { views?: unknown } | undefined)?.views;
        if (typeof count === "number") setViews(count);
      })
      .catch(() => {
        // Aborted or offline: the slot stays empty.
      });
    return () => controller.abort();
  }, [slug]);

  return (
    <span className="inline-flex min-w-28 gap-x-2 tabular-nums">
      {views !== undefined && (
        <>
          <span aria-hidden>·</span>
          <span>
            {formatter.format(views)} {views === 1 ? "view" : "views"}
          </span>
        </>
      )}
    </span>
  );
}

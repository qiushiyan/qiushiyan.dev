"use client";

import { useEffect, useState } from "react";

// Reading room below the sticky nav: a heading counts as current once it
// scrolls within this distance of its anchor position.
const READING_ROOM = 32;

/**
 * The slug of the section the reader is in: the last heading whose top has
 * passed the nav, or the last heading once the page is scrolled to the end.
 * Reading positions on every scroll (not an IntersectionObserver band) keeps
 * it right after jumps, deep links and scrolling up.
 */
export function useActiveHeading(slugs: string[]) {
  const [active, setActive] = useState<string | null>(slugs[0] ?? null);

  useEffect(() => {
    const elements = slugs
      .map((slug) => document.getElementById(slug))
      .filter((element): element is HTMLElement => element !== null);
    if (elements.length === 0) return;

    // The headings' scroll-margin-top is where an anchor jump puts them.
    const offset =
      parseFloat(getComputedStyle(elements[0]).scrollMarginTop) + READING_ROOM;

    let frame = 0;
    const update = () => {
      frame = 0;
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;
      let current = elements[0];
      for (const element of elements) {
        if (element.getBoundingClientRect().top - offset > 0) break;
        current = element;
      }
      setActive(atBottom ? elements[elements.length - 1].id : current.id);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(frame);
    };
  }, [slugs]);

  return active;
}

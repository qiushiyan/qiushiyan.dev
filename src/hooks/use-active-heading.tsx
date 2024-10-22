"use client";

import { useEffect, useState } from "react";
import { Post } from "#content";

export const useActiveHeading = ({
  headings,
}: {
  headings: Post["headings"];
}) => {
  const [activeHeading, setActiveHeading] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHeading(entry.target.id);
          }
        });
      },
      { rootMargin: "-40px 0px -80% 0px" }
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.slug);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  return activeHeading;
};

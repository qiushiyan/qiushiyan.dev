"use client";

import { useEffect, useState } from "react";

import { BLOGS_HEADING, PROJECTS_HEADING } from "@/constants";
import { cn } from "@/lib/utils";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

const sections = [
  {
    id: BLOGS_HEADING,
    label: "Blogs",
  },
  {
    id: PROJECTS_HEADING,
    label: "Projects",
  },
];

export function SectionIndicator() {
  const [activeHeading, setActiveHeading] = useState<string | undefined>(
    undefined
  );
  const observers = new Map<string, IntersectionObserver>();

  useEffect(() => {
    const blogObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!activeHeading) {
              setActiveHeading(entry.target.id);
            }
          }
        });
      },
      { rootMargin: "-40px 0px -80% 0px" }
    );

    const projectObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHeading(entry.target.id);
          } else {
            setActiveHeading(BLOGS_HEADING);
          }
        });
      },
      { rootMargin: "0px 0px -40% 0px" }
    );

    blogObserver.observe(document.getElementById(BLOGS_HEADING) as Element);
    projectObserver.observe(
      document.getElementById(PROJECTS_HEADING) as Element
    );

    observers.set(BLOGS_HEADING, blogObserver);
    observers.set(PROJECTS_HEADING, projectObserver);

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  return (
    <div className="hidden flex-col gap-2 lg:flex">
      {sections.map(({ id, label }) => (
        <Link href={`#${id}`} className="flex items-center gap-2">
          <ArrowRightIcon
            className={cn(
              "size-3 shrink-0 transition-transform duration-300",
              activeHeading === id
                ? "translate-x-0"
                : "-translate-x-2 opacity-0"
            )}
          />
          <span className="font-medium tracking-wide">{label}</span>
        </Link>
      ))}
    </div>
  );
}

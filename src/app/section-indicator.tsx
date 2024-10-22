"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

import { HOME_SECTIONS } from "@/constants";
import { cn } from "@/lib/utils";

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
            setActiveHeading(entry.target.id);
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
          }
        });
      },
      { rootMargin: "0px 0px -40% 0px" }
    );

    blogObserver.observe(
      document.getElementById(HOME_SECTIONS.blogs.id) as Element
    );
    projectObserver.observe(
      document.getElementById(HOME_SECTIONS.projects.id) as Element
    );

    observers.set(HOME_SECTIONS.blogs.label, blogObserver);
    observers.set(HOME_SECTIONS.projects.label, projectObserver);

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  return (
    <div className="hidden flex-col gap-2 lg:flex">
      {Object.entries(HOME_SECTIONS).map(([, { id, label }]) => (
        <Link href={`#${id}`} className="flex items-center gap-2" key={id}>
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

"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { isActivePath, navLinks } from "@/lib/navigation";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        aria-label="Menu"
        className="grid size-11 place-items-center rounded-md text-muted-foreground transition-[color,scale] duration-150 ease-out hover:text-foreground active:scale-[0.96] md:hidden"
      >
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-5"
        >
          <path d="M3 5H11" />
          <path d="M3 12H16" />
          <path d="M3 19H21" />
        </svg>
      </PopoverTrigger>
      {/* rounded-lg (8px) = item rounded-sm (4px) + p-1 (4px), so the corners are concentric */}
      <PopoverContent
        align="end"
        collisionPadding={16}
        className="w-56 rounded-lg p-1"
      >
        <nav aria-label="Main">
          <ul>
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  aria-current={
                    isActivePath(pathname, link.href) ? "page" : undefined
                  }
                  className="flex h-11 items-center rounded-sm px-3 text-base text-muted-foreground -outline-offset-2 transition-colors hover:bg-muted hover:text-foreground aria-[current=page]:bg-muted aria-[current=page]:text-foreground"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </PopoverContent>
    </Popover>
  );
}

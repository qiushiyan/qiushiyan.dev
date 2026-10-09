"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      type="button"
      aria-label="Toggle dark mode"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="grid size-10 place-items-center rounded-md text-muted-foreground transition-[color,scale] duration-150 ease-out hover:text-foreground active:scale-[0.96] max-md:size-11"
    >
      {/* Both icons are in the server HTML and the `dark` class picks one, so nothing flashes on hydration. */}
      <SunIcon aria-hidden strokeWidth={1.5} className="size-5 dark:hidden" />
      <MoonIcon
        aria-hidden
        strokeWidth={1.5}
        className="hidden size-5 dark:block"
      />
    </button>
  );
}

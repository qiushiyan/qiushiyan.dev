"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    if (!document.startViewTransition) return setTheme(nextTheme);

    document.startViewTransition({
      // @ts-ignore
      update: () => setTheme(nextTheme),
      types: ["switch-theme"],
    });
  };

  return (
    <button
      className="relative flex transition-all hover:text-primary/80"
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      <Sun className="size-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute size-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </button>
  );
}

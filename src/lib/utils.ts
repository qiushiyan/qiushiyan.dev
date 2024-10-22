import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import type { ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const postViewTransitionName = (slug: string) => {
  return `post-${slug}`;
};

export const recipeViewTransitionName = (slug: string) => {
  return `recipe-${slug}`;
};

export const noteViewTransitionName = (slug: string) => {
  return `note-${slug}`;
};

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

/** URL form of a post tag: "Machine Learning" → "machine-learning". */
export const tagSlug = (tag: string) =>
  tag.toLowerCase().replace(/[^a-z0-9]+/g, "-");

const recipeLanguageLabels: Record<string, string> = { python: "Python" };

/** Display name of a recipe group key: "python" → "Python". */
export const recipeLanguageLabel = (language: string) =>
  recipeLanguageLabels[language] ??
  language.charAt(0).toUpperCase() + language.slice(1);

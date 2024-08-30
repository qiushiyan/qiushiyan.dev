import { Post } from "#content";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const postViewTransitionName = (slug: string) => {
  return `post-${slug}`;
};

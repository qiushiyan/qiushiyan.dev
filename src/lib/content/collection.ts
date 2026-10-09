import { isProduction } from "@/constants";

/** Drafts are visible in development and hidden from production builds. */
export const isPublished = (entry: { draft?: boolean }) =>
  !isProduction || !entry.draft;

export const byDateDesc = <T extends { date: string }>(a: T, b: T) =>
  b.date.localeCompare(a.date);

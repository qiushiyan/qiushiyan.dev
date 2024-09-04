import { cache } from "react";

import { eq, sql } from "drizzle-orm";

import { db } from "../db";
import { postViews } from "../db/schema";

export const incrementView = cache(async (slug: string) => {
  await db
    .insert(postViews)
    .values({ postSlug: slug, viewCount: 1 })
    .onConflictDoUpdate({
      target: postViews.postSlug,
      set: { viewCount: sql`${postViews.viewCount} + 1` },
    });
});

export const getViews = cache(async (slug: string) => {
  const views = await db
    .select()
    .from(postViews)
    .where(eq(postViews.postSlug, slug));
  return views[0]?.viewCount ?? 0;
});

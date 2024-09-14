"use server";

import { cache } from "react";

import { getRequestContext } from "@cloudflare/next-on-pages";

export const incrementView = cache(async (slug: string) => {
  const { env } = getRequestContext();
  await env.DB.prepare(
    `INSERT INTO post_views (post_slug, view_count)
   VALUES (?, 1)
   ON CONFLICT (post_slug)
   DO UPDATE SET view_count = view_count + 1
   WHERE post_slug = ?`
  )
    .bind(slug, slug)
    .run();
  //   await db
  //     .insert(postViews)
  //     .values({ postSlug: slug, viewCount: 1 })
  //     .onConflictDoUpdate({
  //       target: postViews.postSlug,
  //       set: { viewCount: sql`${postViews.viewCount} + 1` },
  //     });
});

export const getViews = cache(async (slug: string) => {
  const { env } = getRequestContext();

  const result = await env.DB.prepare(
    `SELECT view_count FROM post_views WHERE post_slug = ? LIMIT 1`
  )
    .bind(slug)
    .first();

  const viewCount = (result?.view_count as number) ?? 0;

  return viewCount;
  //   const views = await db
  //     .select()
  //     .from(postViews)
  //     .where(eq(postViews.postSlug, slug));
  //   return views[0]?.viewCount ?? 0;
});

import { env } from "cloudflare:workers";

/*
  Post view counts in D1 (`post_views`, see migrations/). Callers check that
  the slug is a published post first, so the table only holds real posts.
*/

export async function getViews(slug: string): Promise<number> {
  const row = await env.DB.prepare("SELECT view_count FROM post_views WHERE post_slug = ?1")
    .bind(slug)
    .first<{ view_count: number }>();
  return row?.view_count ?? 0;
}

/** Adds one view and returns the new count, in a single statement. */
export async function incrementViews(slug: string): Promise<number> {
  const row = await env.DB.prepare(
    `INSERT INTO post_views (post_slug, view_count) VALUES (?1, 1)
     ON CONFLICT (post_slug) DO UPDATE SET view_count = view_count + 1
     RETURNING view_count`
  )
    .bind(slug)
    .first<{ view_count: number }>();
  return row?.view_count ?? 0;
}

/**
 * Whether this visitor may count another view of `slug` now: one per IP and
 * post per minute, via the Workers Rate Limiting binding. Without the binding
 * every view counts.
 */
export async function mayIncrementViews(slug: string, ip: string | null): Promise<boolean> {
  const limiter = (env as Partial<Env>).VIEWS_RATE_LIMITER;
  if (!limiter) return true;
  const { success } = await limiter.limit({ key: `${ip ?? "unknown"}:${slug}` });
  return success;
}

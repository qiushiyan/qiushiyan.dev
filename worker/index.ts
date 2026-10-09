/*
  The site's Worker. Every page is a static file in dist/, served by Workers
  Static Assets; `run_worker_first` in wrangler.jsonc sends only /api/* here.

  View counts for the post page's <view-count> element, in D1 (`post_views`,
  see migrations/):
    GET  /api/views/:slug → { views }
    POST /api/views/:slug → counts one view, then { views }
*/

const noStore = { "Cache-Control": "no-store" };
const json = (body: unknown, status = 200) => Response.json(body, { status, headers: noStore });

/*
  A slug is a published post when its prerendered page exists: drafts are
  never built for production.
*/
const isPublished = async (env: Env, slug: string, request: Request) => {
  if (!/^[a-z0-9-]+$/.test(slug)) return false;
  const page = await env.ASSETS.fetch(new URL(`/posts/${slug}`, request.url), {
    method: "HEAD",
  });
  return page.ok;
};

/**
 * Only the site's own pages may count views. Browsers send `Sec-Fetch-Site`
 * (and `Origin` on POST) and other sites can't forge them; a client that
 * sends neither is not a browser on this site.
 */
const isSameOrigin = (request: Request) => {
  const site = request.headers.get("sec-fetch-site");
  if (site) return site === "same-origin";
  const origin = request.headers.get("origin");
  return origin !== null && origin === new URL(request.url).origin;
};

const getViews = async (env: Env, slug: string) =>
  (
    await env.DB.prepare("SELECT view_count FROM post_views WHERE post_slug = ?1")
      .bind(slug)
      .first<{ view_count: number }>()
  )?.view_count ?? 0;

/** Adds one view and returns the new count, in a single statement. */
const incrementViews = async (env: Env, slug: string) =>
  (
    await env.DB.prepare(
      `INSERT INTO post_views (post_slug, view_count) VALUES (?1, 1)
       ON CONFLICT (post_slug) DO UPDATE SET view_count = view_count + 1
       RETURNING view_count`,
    )
      .bind(slug)
      .first<{ view_count: number }>()
  )?.view_count ?? 0;

/** One counted view per IP and post per minute (Workers Rate Limiting binding). */
const mayIncrementViews = async (env: Env, slug: string, ip: string | null) => {
  const { success } = await env.VIEWS_RATE_LIMITER.limit({
    key: `${ip ?? "unknown"}:${slug}`,
  });
  return success;
};

export default {
  async fetch(request, env) {
    const match = new URL(request.url).pathname.match(/^\/api\/views\/([^/]+)$/);
    if (!match) return env.ASSETS.fetch(request);

    const slug = decodeURIComponent(match[1]);
    if (!(await isPublished(env, slug, request))) return json({ error: "Not found" }, 404);

    if (request.method === "GET") return json({ views: await getViews(env, slug) });
    if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);
    if (!isSameOrigin(request)) return json({ error: "Cross-origin request" }, 403);

    // A visitor reloading within the window sees the count without adding to it.
    const allowed = await mayIncrementViews(env, slug, request.headers.get("cf-connecting-ip"));
    return json({
      views: allowed ? await incrementViews(env, slug) : await getViews(env, slug),
    });
  },
} satisfies ExportedHandler<Env>;

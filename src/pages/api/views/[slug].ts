import { env } from "cloudflare:workers";

import { getViews, incrementViews, mayIncrementViews } from "@/lib/server/views";

import type { APIRoute } from "astro";

/*
  View counts for the post page's <view-count> element.
  GET  /api/views/:slug → { views }
  POST /api/views/:slug → counts one view, then { views }
  The only route rendered on request; every page is prerendered.
*/
export const prerender = false;

const noStore = { "Cache-Control": "no-store" };

const notFound = () => Response.json({ error: "Not found" }, { status: 404, headers: noStore });

/*
  A slug is a published post when its prerendered page exists: drafts are
  never built for production. Asking the static assets, instead of reading
  the content collection, keeps every post's HTML out of the Worker bundle.
*/
const isPublished = async (slug: string | undefined, request: Request) => {
  if (!slug || !/^[a-z0-9-]+$/.test(slug)) return false;
  const page = await env.ASSETS.fetch(new URL(`/posts/${slug}`, request.url), { method: "HEAD" });
  return page.ok;
};

export const GET: APIRoute = async ({ params, request }) => {
  if (!(await isPublished(params.slug, request))) return notFound();
  return Response.json({ views: await getViews(params.slug!) }, { headers: noStore });
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

export const POST: APIRoute = async ({ params, request }) => {
  const slug = params.slug;
  if (!(await isPublished(slug, request))) return notFound();
  if (!isSameOrigin(request)) {
    return Response.json({ error: "Cross-origin request" }, { status: 403, headers: noStore });
  }
  // A visitor reloading within the window sees the count without adding to it.
  const allowed = await mayIncrementViews(slug!, request.headers.get("cf-connecting-ip"));
  const views = allowed ? await incrementViews(slug!) : await getViews(slug!);
  return Response.json({ views }, { headers: noStore });
};

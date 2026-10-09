import { getPost } from "@/lib/content/posts";
import {
  getViews,
  incrementViews,
  mayIncrementViews,
} from "@/lib/server/views";
import type { NextRequest } from "next/server";

/*
  View counts for the post page's client island (PostViewCount).
  GET  /api/views/:slug → { views }
  POST /api/views/:slug → counts one view, then { views }
*/

const noStore = { "Cache-Control": "no-store" };

const notFound = () =>
  Response.json({ error: "Not found" }, { status: 404, headers: noStore });

export async function GET(
  _request: NextRequest,
  { params }: RouteContext<"/api/views/[slug]">
) {
  const { slug } = await params;
  if (!getPost(slug)) return notFound();
  return Response.json({ views: await getViews(slug) }, { headers: noStore });
}

/**
 * Only the site's own pages may count views. Browsers send `Sec-Fetch-Site`
 * (and `Origin` on POST) and other sites can't forge them; a client that
 * sends neither is not a browser on this site.
 */
const isSameOrigin = (request: NextRequest) => {
  const site = request.headers.get("sec-fetch-site");
  if (site) return site === "same-origin";
  const origin = request.headers.get("origin");
  return origin !== null && origin === request.nextUrl.origin;
};

export async function POST(
  request: NextRequest,
  { params }: RouteContext<"/api/views/[slug]">
) {
  const { slug } = await params;
  if (!getPost(slug)) return notFound();
  if (!isSameOrigin(request)) {
    return Response.json(
      { error: "Cross-origin request" },
      { status: 403, headers: noStore }
    );
  }

  // A visitor reloading within the window sees the count without adding to it.
  const allowed = await mayIncrementViews(
    slug,
    request.headers.get("cf-connecting-ip")
  );
  const views = allowed ? await incrementViews(slug) : await getViews(slug);
  return Response.json({ views }, { headers: noStore });
}

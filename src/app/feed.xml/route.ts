import { getPosts } from "@/lib/content/posts";
import { routes } from "@/lib/navigation";
import { markdownToPlainText } from "@/lib/plain-text";
import { siteConfig } from "@/lib/site";

// GET route handlers are dynamic by default; the feed only changes on deploy.
export const dynamic = "force-static";

const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const absoluteUrl = (path: string) => new URL(path, siteConfig.url).href;

// RSS 2.0 requires RFC 822 dates; toUTCString() produces that format.
const rfc822 = (iso: string) => new Date(iso).toUTCString();

export function GET() {
  const posts = getPosts();
  const feedUrl = absoluteUrl("/feed.xml");
  const lastBuildDate = posts
    .map((post) => post.lastModified ?? post.date)
    .sort()
    .at(-1);

  const items = posts.map((post) => {
    const url = escapeXml(absoluteUrl(post.href));
    return [
      "    <item>",
      `      <title>${escapeXml(post.title)}</title>`,
      `      <link>${url}</link>`,
      `      <guid isPermaLink="true">${url}</guid>`,
      `      <pubDate>${rfc822(post.date)}</pubDate>`,
      `      <description>${escapeXml(markdownToPlainText(post.description))}</description>`,
      ...post.tags.map((tag) => `      <category>${escapeXml(tag)}</category>`),
      "    </item>",
    ].join("\n");
  });

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "  <channel>",
    `    <title>${escapeXml(siteConfig.name)}</title>`,
    `    <link>${escapeXml(absoluteUrl(routes.home))}</link>`,
    `    <description>${escapeXml(siteConfig.description)}</description>`,
    "    <language>en</language>",
    ...(lastBuildDate
      ? [`    <lastBuildDate>${rfc822(lastBuildDate)}</lastBuildDate>`]
      : []),
    `    <atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" />`,
    ...items,
    "  </channel>",
    "</rss>",
    "",
  ].join("\n");

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}

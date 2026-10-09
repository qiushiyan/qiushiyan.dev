import rss from "@astrojs/rss";
import { render } from "astro:content";

import { pipelineFrontmatter } from "@/lib/content/articles";
import { getPosts } from "@/lib/content/posts";
import { routes } from "@/lib/navigation";
import { siteConfig } from "@/lib/site";
import type { APIRoute } from "astro";

/*
  The RSS feed of posts. Item GUIDs are the post URLs (the @astrojs/rss
  default, and what the Next.js feed used), so subscribers see no duplicates.
*/
export const GET: APIRoute = async () => {
  const posts = await getPosts();
  const modified = await Promise.all(
    posts.map(
      async (post) =>
        pipelineFrontmatter((await render(post)).remarkPluginFrontmatter).lastModified,
    ),
  );
  const lastBuildDate = [...modified, ...posts.map((post) => post.data.date.toISOString())]
    .filter((date) => date !== undefined)
    .sort()
    .at(-1);
  const feedUrl = new URL(routes.feed, siteConfig.url).href;

  return rss({
    title: siteConfig.name,
    description: siteConfig.description,
    site: siteConfig.url,
    // GUIDs must stay the slashless post URLs, or readers show every post as new again.
    trailingSlash: false,
    xmlns: { atom: "http://www.w3.org/2005/Atom" },
    customData: [
      "<language>en</language>",
      lastBuildDate && `<lastBuildDate>${new Date(lastBuildDate).toUTCString()}</lastBuildDate>`,
      `<atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />`,
    ]
      .filter(Boolean)
      .join(""),
    items: posts.map((post) => ({
      title: post.data.title,
      link: routes.post(post.id),
      pubDate: post.data.date,
      description: post.data.descriptionText,
      categories: post.data.tags,
    })),
  });
};

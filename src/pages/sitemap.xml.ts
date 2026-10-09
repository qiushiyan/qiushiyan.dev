import { render } from "astro:content";

import { pipelineFrontmatter } from "@/lib/content/articles";
import { getNotes } from "@/lib/content/notes";
import { getPosts } from "@/lib/content/posts";
import { getRecipes, runnableGroups } from "@/lib/content/recipes";
import { routes } from "@/lib/navigation";
import { siteConfig } from "@/lib/site";
import type { Article } from "@/lib/content/articles";
import type { APIRoute } from "astro";

/*
  /sitemap.xml, with each article's last-modified date from git. (The
  @astrojs/sitemap integration writes sitemap-index.xml and can't see
  content dates, so the site keeps this small endpoint instead.)
*/
const escapeXml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const lastModified = async (entry: Article) =>
  pipelineFrontmatter((await render(entry)).remarkPluginFrontmatter).lastModified ??
  entry.data.date.toISOString();

const latest = (dates: string[]) => dates.toSorted().at(-1);

export const GET: APIRoute = async () => {
  const [posts, notes, recipes] = await Promise.all([getPosts(), getNotes(), getRecipes()]);
  const postDates = await Promise.all(posts.map(lastModified));
  const noteDates = await Promise.all(notes.map(lastModified));

  const urls: { path: string; lastmod?: string }[] = [
    { path: routes.home, lastmod: latest([...postDates, ...noteDates]) },
    { path: routes.posts, lastmod: latest(postDates) },
    { path: routes.notes, lastmod: latest(noteDates) },
    { path: routes.recipes },
    { path: routes.about },
    ...posts.map((post, i) => ({
      path: routes.post(post.id),
      lastmod: postDates[i],
    })),
    ...notes.map((note, i) => ({
      path: routes.note(note.id),
      lastmod: noteDates[i],
    })),
    ...recipes
      .filter((recipe) => (runnableGroups as readonly string[]).includes(recipe.data.group))
      .map((recipe) => ({
        path: routes.recipe(recipe.data.group, recipe.data.slug),
      })),
  ];

  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map(
      ({ path, lastmod }) =>
        `<url><loc>${escapeXml(new URL(path, siteConfig.url).href)}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}</url>`,
    ),
    "</urlset>",
    "",
  ].join("\n");
  return new Response(body, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};

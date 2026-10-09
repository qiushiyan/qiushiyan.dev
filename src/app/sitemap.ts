import { getNotes } from "@/lib/content/notes";
import { getPosts } from "@/lib/content/posts";
import { getRecipeGroups } from "@/lib/content/recipes";
import { routes } from "@/lib/navigation";
import { siteConfig } from "@/lib/site";
import type { MetadataRoute } from "next";

const absoluteUrl = (path: string) => new URL(path, siteConfig.url).href;

/** The most recent `lastModified ?? date` among entries, if any. */
const latest = (entries: { date: string; lastModified?: string }[]) =>
  entries
    .map((entry) => entry.lastModified ?? entry.date)
    .sort()
    .at(-1);

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getPosts();
  const notes = getNotes();
  const recipes = Object.entries(getRecipeGroups()).flatMap(
    ([group, entries]) =>
      entries.map((recipe) => routes.recipe(group, recipe.slug))
  );

  return [
    {
      url: absoluteUrl(routes.home),
      lastModified: latest([...posts, ...notes]),
    },
    { url: absoluteUrl(routes.posts), lastModified: latest(posts) },
    { url: absoluteUrl(routes.notes), lastModified: latest(notes) },
    { url: absoluteUrl(routes.recipes) },
    { url: absoluteUrl(routes.about) },
    ...posts.map((post) => ({
      url: absoluteUrl(post.href),
      lastModified: post.lastModified ?? post.date,
    })),
    ...notes.map((note) => ({
      url: absoluteUrl(note.href),
      lastModified: note.lastModified ?? note.date,
    })),
    ...recipes.map((href) => ({ url: absoluteUrl(href) })),
  ];
}

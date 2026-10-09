import { getNotes } from "@/lib/content/notes";
import { getPosts } from "@/lib/content/posts";
import { getRecipes, groupLabel } from "@/lib/content/recipes";
import { renderOgImage } from "@/lib/og";
import { siteConfig } from "@/lib/site";
import type { APIRoute, GetStaticPaths } from "astro";

/*
  Open Graph cards, prerendered: /og/site.png for index pages, and one per
  post, note and recipe (/og/posts/<slug>.png, …). Pages name theirs with
  BaseLayout's `ogCard` prop.
*/
export const getStaticPaths = (async () => {
  const [posts, notes, recipes] = await Promise.all([getPosts(), getNotes(), getRecipes()]);
  const card = (path: string, title: string, description?: string) => ({
    params: { card: path },
    props: { title, description },
  });
  return [
    card("site", siteConfig.name, siteConfig.description),
    ...posts.map((post) => card(`posts/${post.id}`, post.data.title, post.data.descriptionText)),
    ...notes.map((note) =>
      card(`notes/${note.id}`, note.data.title, `Note · ${note.data.category}`),
    ),
    ...recipes.map((recipe) =>
      card(`recipes/${recipe.id}`, recipe.data.title, `${groupLabel(recipe.data.group)} recipe`),
    ),
  ];
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  const png = await renderOgImage(props as { title: string; description?: string });
  return new Response(new Uint8Array(png), {
    headers: { "Content-Type": "image/png" },
  });
};

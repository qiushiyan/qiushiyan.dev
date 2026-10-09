import { notFound } from "next/navigation";

import { getRecipe, getRecipeGroups } from "@/lib/content/recipes";
import { ogImageSize, renderOgImage } from "@/lib/og";
import { siteConfig } from "@/lib/site";
import { recipeLanguageLabel } from "@/lib/utils";

export const alt = `Title card for a code recipe by ${siteConfig.name}`;
export const size = ogImageSize;
export const contentType = "image/png";

// Image routes are route handlers: they don't inherit the layout's
// generateStaticParams, so they list the recipes to prerender themselves.
export const dynamicParams = false;
export const generateStaticParams = () =>
  Object.entries(getRecipeGroups()).flatMap(([group, recipes]) =>
    recipes.map((recipe) => ({ group, slug: recipe.slug }))
  );

export default async function Image({
  params,
}: {
  params: Promise<{ group: string; slug: string }>;
}) {
  const { group, slug } = await params;
  const recipe = getRecipe(group, slug);
  if (!recipe) notFound();

  return renderOgImage({
    title: recipe.title,
    description: `${recipeLanguageLabel(group)} recipe`,
  });
}

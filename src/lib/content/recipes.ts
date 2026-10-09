import "server-only";

import { recipes } from "#content";

export const getRecipeGroups = () => recipes;

export const getRecipe = (group: string, slug: string) =>
  recipes[group]?.find((recipe) => recipe.slug === slug);

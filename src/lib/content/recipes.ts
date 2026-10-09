import { getCollection } from "astro:content";

import type { CollectionEntry } from "astro:content";

export type Recipe = CollectionEntry<"recipes">;

/** Groups with a runnable editor; the recipe page renders only these. */
export const runnableGroups = ["python"] as const;

export const getRecipes = async () => getCollection("recipes");

/** Recipes grouped by language, in index.yaml order. */
export const groupRecipes = (recipes: Recipe[]) => {
  const groups = Map.groupBy(recipes, (recipe) => recipe.data.group);
  return [...groups].map(([group, list]) => ({
    group,
    label: groupLabel(group),
    recipes: list,
  }));
};

const groupLabels: Record<string, string> = { python: "Python", css: "CSS" };

/** Display name of a recipe group key: "python" → "Python". */
export const groupLabel = (group: string) =>
  groupLabels[group] ?? group.charAt(0).toUpperCase() + group.slice(1);

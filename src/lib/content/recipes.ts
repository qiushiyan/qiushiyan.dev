import { recipes } from "#content";

export const findRecipe = (group: string, slug: string) => {
  return recipes[group].find((recipe) => recipe.slug === slug);
};

export const getRecipesByGroup = (group: string) => {
  return recipes[group];
};

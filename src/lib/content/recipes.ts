import { recipes } from "#content";

export const findRecipe = (slug: string) => {
  return recipes.find((recipe) => recipe.slug === slug);
};

export const getRecipeByLang = (lang: string) => {
  return recipes.filter((recipe) => recipe.lang === lang);
};

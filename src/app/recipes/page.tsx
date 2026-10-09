import { IndexListGroup } from "@/components/index-list";
import { PageHeader } from "@/components/page-layout";
import { PageShell } from "@/components/page-shell";
import { getRecipeGroups } from "@/lib/content/recipes";
import { routes } from "@/lib/navigation";
import { recipeLanguageLabel, recipeViewTransitionName } from "@/lib/utils";
import type { Metadata } from "next";

const description =
  "Short code snippets in various languages. Copy and use them however you like.";

export const metadata: Metadata = {
  title: "Recipes",
  description,
  openGraph: { type: "website", title: "Recipes", description },
};

export default function RecipesPage() {
  return (
    <PageShell>
      <PageHeader title="Recipes" description={description} />
      {Object.entries(getRecipeGroups()).map(([language, recipes]) => (
        <IndexListGroup
          key={language}
          label={recipeLanguageLabel(language)}
          items={recipes.map((recipe) => ({
            href: routes.recipe(language, recipe.slug),
            title: recipe.title,
            viewTransitionName: recipeViewTransitionName(recipe.slug),
          }))}
        />
      ))}
    </PageShell>
  );
}

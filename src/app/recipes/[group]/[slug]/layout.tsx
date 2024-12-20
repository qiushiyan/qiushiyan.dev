import { notFound } from "next/navigation";
import { recipes } from "#content";

import { RecipesHeader } from "@/components/recipes/recipes-header";
import { RecipesSidebar } from "@/components/recipes/recipes-sidebar";
import { SidebarLayout } from "@/components/ui/sidebar";
import { findRecipe } from "@/lib/content/recipes";

export const generateStaticParams = () => {
  const allRecipes = Object.entries(recipes).flatMap(([group, recipes]) =>
    recipes.map((recipe) => ({
      slug: recipe.slug,
      group,
    }))
  );
  return allRecipes;
};

export const generateMetadata = async (
  props: {
    params: Promise<{ group: string; slug: string }>;
  }
) => {
  const params = await props.params;
  const recipe = findRecipe(params.group, params.slug);
  if (!recipe) {
    return {};
  }
  const title = recipe.title;
  const description = `A code snippet`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: `/api/og?title=${title}&description=${description}`,
        },
      ],
    },
  };
};

export default async function Layout(
  props: {
    children: React.ReactNode;
    params: Promise<{ group: string; slug: string }>;
  }
) {
  const params = await props.params;

  const {
    children
  } = props;

  const recipe = findRecipe(params.group, params.slug);
  if (!recipe) {
    return notFound();
  }

  return (
    <SidebarLayout defaultOpen={true} className="flex-col">
      <RecipesSidebar />
      <RecipesHeader
        title={recipe.title}
        slug={recipe.slug}
        group={params.group}
      />
      <main className="flex max-h-[calc(100vh-var(--nav-height))] flex-1 flex-col gap-2 px-2">
        {children}
      </main>
    </SidebarLayout>
  );
}

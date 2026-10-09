import { notFound } from "next/navigation";

import { SiteNav } from "@/components/nav/site-nav";
import { RecipesSidebar } from "@/components/recipes/recipes-sidebar";
import {
  SidebarInset,
  SidebarLayout,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { MAIN_CONTENT_ID } from "@/constants";
import { getRecipe, getRecipeGroups } from "@/lib/content/recipes";
import type { Metadata } from "next";

type Params = { group: string; slug: string };

export const generateStaticParams = (): Params[] =>
  Object.entries(getRecipeGroups()).flatMap(([group, recipes]) =>
    recipes.map((recipe) => ({ group, slug: recipe.slug }))
  );

export const generateMetadata = async (props: {
  params: Promise<Params>;
}): Promise<Metadata> => {
  const { group, slug } = await props.params;
  const recipe = getRecipe(group, slug);
  if (!recipe) return {};

  const title = recipe.title;
  const description = "A code snippet";
  return {
    title,
    description,
    openGraph: { title, description },
  };
};

export default async function Layout(props: {
  children: React.ReactNode;
  params: Promise<Params>;
}) {
  const { group, slug } = await props.params;
  if (!getRecipe(group, slug)) notFound();

  // A full-height tool page: the nav, then the sidebar beside a workspace that
  // fills the rest of the viewport without scrolling the page.
  return (
    <SidebarLayout defaultOpen className="h-dvh flex-col">
      <SiteNav additionalControls={<SidebarTrigger />} />
      <RecipesSidebar />
      <SidebarInset className="min-h-0">
        <main
          id={MAIN_CONTENT_ID}
          className="flex min-h-0 flex-1 flex-col px-4 pb-4"
        >
          {props.children}
        </main>
      </SidebarInset>
    </SidebarLayout>
  );
}

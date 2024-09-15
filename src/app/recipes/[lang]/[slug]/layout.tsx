import { RecipesHeader } from "@/components/recipes/recipes-header";
import { RecipesSidebar } from "@/components/recipes/recipes-sidebar";
import { SidebarLayout } from "@/components/ui/sidebar";
import { findRecipe } from "@/lib/content/recipes";
import { recipes } from "#content";
import { notFound } from "next/navigation";

export const generateStaticParams = () => {
  return recipes.map((recipe) => ({
    slug: recipe.slug,
    lang: recipe.lang,
  }));
};

export const generateMetadata = ({ params }: { params: { slug: string } }) => {
  const recipe = findRecipe(params.slug);
  if (!recipe) {
    return {};
  }
  const title = recipe.title || recipe.filename;
  const description = `A ${recipe.lang} code example`;
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

export default function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  const recipe = findRecipe(params.slug);
  if (!recipe) {
    return notFound();
  }

  return (
    <SidebarLayout defaultOpen={true} className="flex-col">
      <RecipesSidebar />
      <RecipesHeader
        title={recipe.title || recipe.filename}
        lang={recipe.lang}
      />
      <main className="flex max-h-[calc(100vh-var(--nav-height))] flex-1 flex-col gap-2 px-2">
        {children}
      </main>
    </SidebarLayout>
  );
}

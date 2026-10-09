import { notFound } from "next/navigation";
import { Link } from "next-view-transitions";

import { EditorProvider } from "@/components/recipes/editor-provider";
import { PythonControl } from "@/components/recipes/python/python-control";
import { PythonEditor } from "@/components/recipes/python/python-editor";
import { PythonOutput } from "@/components/recipes/python/python-output";
import { PythonProvider } from "@/components/recipes/python/python-provider";
import {
  RecipesEditor,
  RecipesLayout,
  RecipesOutput,
} from "@/components/recipes/recipes-layout";
import { ResizableHandle } from "@/components/ui/resizable";
import { getRecipe } from "@/lib/content/recipes";
import { routes } from "@/lib/navigation";
import { recipeViewTransitionName } from "@/lib/utils";

type Params = {
  slug: string;
  group: string;
};

export default async function Page(props: { params: Promise<Params> }) {
  const { group, slug } = await props.params;
  const recipe = getRecipe(group, slug);
  // Python is the only runnable group so far.
  if (!recipe?.codes || group !== "python") notFound();

  return (
    <EditorProvider defaultCodes={recipe.codes}>
      <PythonProvider>
        <div className="flex min-h-12 items-center gap-2 py-2 text-sm">
          <Link
            href={routes.recipes}
            className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
          >
            Recipes
          </Link>
          <span aria-hidden className="text-muted-foreground">
            /
          </span>
          <h1
            className="min-w-0 truncate font-medium"
            style={{ viewTransitionName: recipeViewTransitionName(slug) }}
          >
            {recipe.title}
          </h1>
          <div className="ml-auto shrink-0">
            <PythonControl />
          </div>
        </div>
        <RecipesLayout>
          <RecipesEditor defaultSize={60}>
            <PythonEditor />
          </RecipesEditor>
          <ResizableHandle withHandle />
          <RecipesOutput defaultSize={40}>
            <PythonOutput />
          </RecipesOutput>
        </RecipesLayout>
      </PythonProvider>
    </EditorProvider>
  );
}

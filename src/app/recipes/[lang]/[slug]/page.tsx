import { EditorControl } from "@/components/recipes/python/editor-control";
import { PythonEditor } from "@/components/recipes/python/python-editor";
import { PythonOutput } from "@/components/recipes/python/python-output";
import { PythonProvider } from "@/components/recipes/python/python-provider";
import {
  RecipesEditor,
  RecipesLayout,
  RecipesOutput,
} from "@/components/recipes/recipes-layout";
import { ResizableHandle } from "@/components/ui/resizable";
import { findRecipe } from "@/lib/content/recipes";
import { notFound } from "next/navigation";

type Params = {
  slug: string;
  lang: string;
};

export default function Page({ params }: { params: Params }) {
  const lang = params.lang;
  const recipe = findRecipe(params.slug);
  if (!recipe || recipe.lang !== lang) {
    return notFound();
  }

  return (
    <PythonProvider code={recipe.code}>
      <EditorControl initialCode={recipe.code} />
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
  );
}

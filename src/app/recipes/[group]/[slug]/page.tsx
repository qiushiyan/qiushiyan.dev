import { notFound } from "next/navigation";

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
import { findRecipe } from "@/lib/content/recipes";

type Params = {
  slug: string;
  group: string;
};

export default function Page({ params }: { params: Params }) {
  const recipe = findRecipe(params.group, params.slug);
  if (!recipe || !recipe.codes) {
    return notFound();
  }

  if (params.group === "python") {
    return (
      <EditorProvider defaultCodes={recipe.codes}>
        <PythonProvider>
          <PythonControl />
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

  if (params.group === "css") {
    return (
      <RecipesLayout>
        <RecipesEditor defaultSize={60}>web editor</RecipesEditor>
        <ResizableHandle withHandle />
        <RecipesOutput defaultSize={40}>web output</RecipesOutput>
      </RecipesLayout>
    );
  }

  return null;
}

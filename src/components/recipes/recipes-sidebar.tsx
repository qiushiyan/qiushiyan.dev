import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Sidebar, SidebarContent, SidebarItem } from "@/components/ui/sidebar";
import { routes } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { Recipe, recipes } from "#content";
import { ChevronRight, FileTextIcon, FolderIcon } from "lucide-react";
import Link from "next/link";

const recipesByLang = recipes.reduce(
  (acc, recipe) => {
    acc[recipe.lang] = [...(acc[recipe.lang] || []), recipe];
    return acc;
  },
  {} as Record<string, Recipe[]>
);

export const RecipesSidebar = () => {
  return (
    <Sidebar className="gap-2">
      <SidebarContent>
        {Object.entries(recipesByLang).map(([lang, recipes]) => (
          <SidebarItem key={lang}>
            <Collapsible defaultOpen={true}>
              <CollapsibleTrigger asChild>
                <div className="group relative mb-3 flex items-center">
                  <div className="flex h-8 min-w-8 flex-1 items-center gap-2 overflow-hidden rounded-md px-1.5 text-sm font-medium outline-none ring-ring transition-all hover:bg-accent hover:text-accent-foreground focus-visible:ring-2">
                    <FolderIcon className="h-4 w-4 shrink-0" />
                    <div className="flex flex-1 overflow-hidden">
                      <div className="line-clamp-1 pr-6">{lang} examples</div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    className="absolute right-1 h-6 w-6 rounded-md p-0 ring-ring transition-all focus-visible:ring-2 group-data-[state=open]:rotate-90"
                  >
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    <span className="sr-only">Toggle</span>
                  </Button>
                </div>
              </CollapsibleTrigger>

              <CollapsibleContent className="px-4">
                <ul className="grid gap-3 px-2">
                  {recipes.map((item) => (
                    <li
                      key={item.slug}
                      className={cn(
                        "line-clamp-2 font-mono text-base hover:underline"
                      )}
                    >
                      <Link
                        href={routes.recipe(item.lang, item.slug)}
                        className="flex items-start gap-2"
                      >
                        <FileTextIcon className="mt-1 size-4 shrink-0" />
                        <span>{item.filename}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </CollapsibleContent>
            </Collapsible>
          </SidebarItem>
        ))}
      </SidebarContent>
    </Sidebar>
  );
};

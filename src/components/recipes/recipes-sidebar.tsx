import {
  Sidebar,
  SidebarContent,
  SidebarItem,
  SidebarLabel,
} from "@/components/ui/sidebar";
import { getRecipeGroups } from "@/lib/content/recipes";
import { recipeLanguageLabel } from "@/lib/utils";
import { RecipesSidebarLink } from "./recipes-sidebar-link";

export const RecipesSidebar = () => {
  return (
    <Sidebar label="Recipes">
      <SidebarContent>
        {Object.entries(getRecipeGroups()).map(([group, recipes]) => (
          <SidebarItem key={group}>
            <SidebarLabel>{recipeLanguageLabel(group)}</SidebarLabel>
            <ul className="flex flex-col gap-0.5">
              {recipes.map((recipe) => (
                <li key={recipe.slug}>
                  <RecipesSidebarLink
                    title={recipe.title}
                    slug={recipe.slug}
                    group={group}
                  />
                </li>
              ))}
            </ul>
          </SidebarItem>
        ))}
      </SidebarContent>
    </Sidebar>
  );
};

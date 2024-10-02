import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Sidebar, SidebarContent, SidebarItem } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { recipes } from "#content";
import { ChevronRight, FolderIcon } from "lucide-react";

import { RecipesSidebarLink } from "./recipes-sidebar-link";

export const RecipesSidebar = () => {
  return (
    <Sidebar className="gap-2">
      <SidebarContent>
        {Object.entries(recipes).map(([group, recipes]) => (
          <SidebarItem key={group}>
            <Collapsible defaultOpen={true}>
              <CollapsibleTrigger asChild>
                <div className="group relative mb-3 flex items-center">
                  <div className="flex h-8 min-w-8 flex-1 items-center gap-2 overflow-hidden rounded-md px-1.5 text-sm font-medium outline-none ring-ring transition-all hover:bg-accent hover:text-accent-foreground focus-visible:ring-2">
                    <FolderIcon className="h-4 w-4 shrink-0" />
                    <div className="flex flex-1 overflow-hidden">
                      <div className="line-clamp-1 pr-6 uppercase">{group}</div>
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

              <CollapsibleContent className="ml-4 border-l">
                <ul className="grid gap-3">
                  {recipes.map((item) => (
                    <li
                      key={item.slug}
                      className={cn("line-clamp-2 text-base")}
                    >
                      <RecipesSidebarLink {...item} group={group} />
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

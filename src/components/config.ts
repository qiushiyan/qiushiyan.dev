import { routes } from "@/lib/navigation";
import { recipes } from "#content";
import { HomeIcon, InfoIcon, NotebookPenIcon } from "lucide-react";

export const NavLinks = {
  Main: [
    {
      href: routes.recipe(recipes[0].lang, recipes[0].slug),
      label: "Recipes",
      viewTransitionName: "recipes",
    },
    {
      href: routes.about,
      label: "About",
      viewTransitionName: "about",
    },
  ],

  Mobile: [
    {
      href: routes.home,
      label: "Home",
      icon: HomeIcon,
    },
    {
      href: routes.posts,
      label: "Posts",
      icon: NotebookPenIcon,
    },
    {
      href: routes.about,
      label: "About",
      icon: InfoIcon,
    },
  ],
};

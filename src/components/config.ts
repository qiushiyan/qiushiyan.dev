import { routes } from "@/lib/navigation";
import { HomeIcon, InfoIcon, NotebookPenIcon } from "lucide-react";

export const NavLinks = {
  Main: [
    {
      href: routes.recipes,
      label: "Recipes",
      viewTransitionName: undefined,
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

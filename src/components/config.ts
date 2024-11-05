import { HomeIcon, InfoIcon, NotebookPenIcon } from "lucide-react";

import { routes } from "@/lib/navigation";

export const NavLinks = {
  Main: [
    {
      href: routes.about,
      label: "About",
      viewTransitionName: "about",
    },
    {
      href: routes.notes,
      label: "Notes",
      viewTransitionName: undefined,
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

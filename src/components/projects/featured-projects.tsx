/* eslint-disable react/jsx-key */
import { getProject, getProjects } from "@/actions/projects";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  SiGo,
  SiR,
  SiReact,
  SiTypescript,
} from "@icons-pack/react-simple-icons";

import { FeaturedProjectsClient } from "./featured-projects.client";

const featured = [
  {
    name: "tidymodels/agua",
    href: "https://tidymodels.github.io/agua/",
    icons: [<SiR className="size-4" />],
  },
  {
    name: "qiushiyan/qlang",
    href: "/projects/qlang",
    icons: [<SiGo className="size-6" />],
  },
  {
    name: "qiushiyan/js-notebook",
    href: "https://jbook.qiushiyan.dev",
    icons: [
      <SiReact className="size-4" />,
      <SiTypescript className="size-4" />,
    ],
  },
  {
    name: "qiushiyan/linux-command-line-cheatsheet",
    icons: [],
  },
  {
    name: "tridata-dev/tridata-web",
    icons: [
      <SiReact className="size-4" />,
      <SiTypescript className="size-4" />,
    ],
  },

  { name: "qiushiyan/go-degit", icons: [<SiGo className="size-6" />] },
];

export const FeaturedProjects = async () => {
  const repos = await Promise.all(
    featured.map(async ({ name, href, icons }) => ({
      name,
      href,
      icons,
      data: await getProject(name),
    }))
  );

  return (
    <div className="w-full px-4">
      <ScrollArea className="w-full">
        <FeaturedProjectsClient repos={repos} />
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

// eslint-disable-next-line react/display-name
FeaturedProjects.Skeleton = () => {
  return (
    <div className="flex justify-center gap-6">
      {featured.map(({ name }) => (
        <Skeleton className="h-48 w-80" key={name} />
      ))}
    </div>
  );
};

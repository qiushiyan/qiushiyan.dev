import { getProject } from "@/actions/projects";
import { Skeleton } from "@/components/ui/skeleton";
import { GitForkIcon, StarIcon } from "lucide-react";
import Link from "next/link";

const featured = [
  {
    name: "tidymodels/agua",
    href: "https://tidymodels.github.io/agua/",
  },
  {
    name: "qiushiyan/js-notebook",
    href: "https://javascript-notebook.netlify.app/",
  },
  {
    name: "qiushiyan/linux-command-line-cheatsheet",
    href: "https://github.com/qiushiyan/linux-command-line-cheatsheet",
  },
  {
    name: "qiushiyan/qlang",
    href: "https://qlang.qiushiyan.dev/",
  },
];

export const FeaturedProjects = async () => {
  const repos = await Promise.all(
    featured.map(async ({ name, href }) => ({
      name,
      href,
      data: await getProject(name),
    }))
  );

  return (
    <div className="grid gap-4">
      {repos.map((repo) => (
        <Link
          className="flex flex-col gap-3 rounded-md p-4 px-4 transition-all hover:bg-muted hover:text-muted-foreground"
          key={repo.name}
          href={repo.href as string}
          target="_blank"
        >
          <h3 className="font-mono text-sm">{repo.name}</h3>
          <p className="line-clamp-2 text-sm">{repo.data.data.description}</p>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <StarIcon className="size-4" />
              <span className="text-sm text-muted-foreground">
                {repo.data.data.stargazers_count}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <GitForkIcon className="size-4" />
              <span className="text-sm text-muted-foreground">
                {repo.data.data.forks_count}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

// eslint-disable-next-line react/display-name
FeaturedProjects.Skeleton = () => {
  return <Skeleton className="h-96 w-full" />;
};

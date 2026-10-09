import { StarIcon } from "lucide-react";

import { getRepoStats } from "@/lib/server/github";

const featured = [
  {
    name: "tidymodels/agua",
    href: "https://tidymodels.github.io/agua",
    description: "Create and evaluate models using tidymodels and h2o",
  },
  {
    name: "qiushiyan/js-notebook",
    href: "https://javascript-notebook.netlify.app",
    description: "An interactive notebook for JavaScript and TypeScript",
  },
  {
    name: "qiushiyan/linux-command-line-cheatsheet",
    href: "https://github.com/qiushiyan/linux-command-line-cheatsheet",
    description: "A cheatsheet of common Linux commands",
  },
];

const capitalize = (text: string) =>
  text.charAt(0).toUpperCase() + text.slice(1);

/** Featured repositories. GitHub data is fetched at build time; the written description covers a failed request. */
export async function FeaturedProjects() {
  const projects = await Promise.all(
    featured.map(async (project) => {
      const stats = await getRepoStats(project.name);
      return {
        ...project,
        description: capitalize(stats?.description || project.description),
        stars: stats?.stars ?? 0,
      };
    })
  );

  return (
    <ul className="mt-4 divide-y divide-border">
      {projects.map((project) => (
        <li key={project.name} className="group relative py-4 first:pt-0">
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="min-w-0 font-mono text-sm font-medium break-words">
              <a
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors group-hover:text-primary after:absolute after:inset-0"
              >
                {project.name}
              </a>
            </h3>
            {project.stars > 0 && (
              <span className="flex shrink-0 items-center gap-1 text-sm text-muted-foreground tabular-nums">
                <StarIcon aria-hidden strokeWidth={1.5} className="size-3.5" />
                {project.stars}
                <span className="sr-only">stars</span>
              </span>
            )}
          </div>
          <p className="mt-1 text-sm/6 text-pretty text-muted-foreground">
            {project.description}
          </p>
        </li>
      ))}
    </ul>
  );
}

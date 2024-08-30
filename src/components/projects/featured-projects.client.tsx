"use client";

import { useState } from "react";

import { getProject } from "@/actions/projects";

import { ProjectCard } from "./project-card";

type Repos = {
  name: string;
  href: string | undefined;
  icons: React.ReactNode[];
  data: Awaited<ReturnType<typeof getProject>>;
}[];

export const FeaturedProjectsClient = ({ repos }: { repos: Repos }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const calculateTranslate = (index: number) => {
    if (hoveredIndex === null) return 0;
    const diff = index - hoveredIndex;
    return diff * 40; // Increased spread for more noticeable effect
  };

  return (
    <div className="flex gap-6 pb-8 pt-4">
      {repos.map((repo, index) => (
        <ProjectCard
          key={repo.name}
          data={{
            name: repo.name,
            description: repo.data.data.description,
            stargazers_count: repo.data.data.stargazers_count,
            forks_count: repo.data.data.forks_count,
            href: repo.href || repo.data.data.html_url,
            icons: repo.icons,
          }}
          style={{
            transform: `translateX(${calculateTranslate(index)}px) scale(${
              hoveredIndex === index ? 1.2 : 1
            })`,
            zIndex: hoveredIndex === index ? 10 : 1,
          }}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
        />
      ))}
    </div>
  );
};

"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { GitForkIcon, StarIcon } from "lucide-react";
import Link from "next/link";

type Data = {
  name: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  href: string;
  icons: React.ReactNode[];
};

interface ProjectCardProps extends React.HTMLAttributes<HTMLDivElement> {
  data: Data;
}

export const ProjectCard = ({ data, className, ...rest }: ProjectCardProps) => {
  return (
    <Link href={data.href} className="!text-foreground hover:!no-underline">
      <div
        className={cn(
          "flex h-full w-80 flex-col justify-between gap-2 rounded-md border-2 p-4 transition-all duration-300 ease-out hover:shadow-lg",
          className
        )}
        {...rest}
      >
        <h3 className="text-lg font-semibold">{data.name}</h3>
        <p className="mb-2 text-sm text-muted-foreground">{data.description}</p>
        <footer className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <p className="flex items-center gap-1">
              <StarIcon className="h-4 w-4" />
              <span className="text-sm text-muted-foreground">
                {data.stargazers_count}
              </span>
            </p>
            <p className="flex items-center gap-1">
              <GitForkIcon className="h-4 w-4" />
              <span className="text-sm text-muted-foreground">
                {data.forks_count}
              </span>
            </p>
          </div>
          <div className="flex gap-2">
            {data.icons.map((icon) => (
              <>{icon}</>
            ))}
          </div>
        </footer>
      </div>
    </Link>
  );
};

// eslint-disable-next-line react/display-name
ProjectCard.Skeleton = () => {
  return <Skeleton className="h-40 w-80" />;
};

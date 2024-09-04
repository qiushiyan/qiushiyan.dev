import React from "react";

import { getViews } from "@/actions/views";
import { cn } from "@/lib/utils";

import { Skeleton } from "../ui/skeleton";

export const PostViews = async ({
  slug,
  className,
  ...rest
}: React.ComponentProps<"p"> & {
  slug: string;
}) => {
  const views = await getViews(slug);
  return (
    <p className={cn("text-muted-foreground", className)} {...rest}>
      {views} views
    </p>
  );
};

// eslint-disable-next-line react/display-name
PostViews.Skeleton = () => <Skeleton className="h-4 w-10" />;

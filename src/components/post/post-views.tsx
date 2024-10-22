import React from "react";

import { getViews } from "@/actions/views";
import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";

export const PostViews = async ({
  slug,
  className,
  numberOnly,
  ...rest
}: React.ComponentProps<"p"> & {
  slug: string;
  numberOnly?: boolean;
}) => {
  const views = await getViews(slug);
  return (
    <span className={cn(className)} {...rest}>
      {numberOnly ? views : `${views} views`}
    </span>
  );
};

// eslint-disable-next-line react/display-name
PostViews.Skeleton = () => <Skeleton className="h-4 w-10" />;

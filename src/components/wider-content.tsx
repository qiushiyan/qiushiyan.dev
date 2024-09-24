import React from "react";

import { cn } from "@/lib/utils";

export function WiderContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "!col-span-full grid grid-cols-3 gap-4 p-4 lg:gap-8 lg:p-12",
        className
      )}
      {...props}
    />
  );
}

export function WiderContentMain({
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("col-span-2", className)} {...rest} />;
}

export function WiderContentAside({
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("col-span-1", className)} {...rest} />;
}

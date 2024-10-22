import Link from "next/link";

import { cn } from "@/lib/utils";

interface TocItemProps extends React.HTMLAttributes<HTMLAnchorElement> {
  slug: string;
  children: React.ReactNode;
}
export const TocItem = ({
  slug,
  children,
  className,
  ...props
}: TocItemProps) => {
  return (
    <Link
      href={`#${slug}`}
      className={cn(
        "flex items-center gap-2 overflow-hidden rounded-md px-2 py-1 font-medium text-muted-foreground ring-ring transition-all hover:text-primary/80 focus-visible:ring-2",
        className
      )}
      {...props}
    >
      {children}
    </Link>
  );
};

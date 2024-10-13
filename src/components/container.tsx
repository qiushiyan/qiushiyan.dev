import { cn } from "@/lib/utils";
import { clsx } from "clsx";

export function Container({
  className,
  innerClassName,
  children,
}: {
  className?: string;
  innerClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={clsx(className, "px-6 lg:px-8")}>
      <div className={cn("mx-auto max-w-2xl lg:max-w-7xl", innerClassName)}>
        {children}
      </div>
    </div>
  );
}

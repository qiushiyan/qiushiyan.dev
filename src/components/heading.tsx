import { cn } from "@/lib/utils";

export const Heading = ({
  children,
  className,
  ...rest
}: React.ComponentProps<"h2">) => {
  return (
    <h2
      className={cn("my-4 text-3xl font-bold text-primary/80", className)}
      {...rest}
    >
      {children}
    </h2>
  );
};

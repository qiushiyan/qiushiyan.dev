import { cn } from "@/lib/utils";

export const Heading = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <h2 className={cn("my-4 text-3xl font-bold text-primary", className)}>
      {children}
    </h2>
  );
};

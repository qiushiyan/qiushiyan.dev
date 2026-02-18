import { cn } from "@/lib/utils";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export const basicProseClasses = cn(
  "prose max-w-none prose-a:underline prose-a:underline-offset-4 prose-a:transition-colors hover:prose-a:text-primary/80 prose-code:before:hidden prose-code:after:hidden"
);

export const ArticleProse = ({ children, className, ...rest }: Props) => {
  return (
    <div
      className={cn(
        basicProseClasses,
        "text-base/7 lg:text-lg/10",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
};

export const BasicProse = ({ children, className, ...rest }: Props) => {
  return (
    <div className={cn(basicProseClasses, className)} {...rest}>
      {children}
    </div>
  );
};

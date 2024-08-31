import { cn } from "@/lib/utils";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export const basicProseClasses = cn(
  "prose-quoteless prose prose-neutral max-w-none dark:prose-invert prose-a:underline prose-a:underline-offset-4 prose-a:transition-colors prose-a:hover:text-primary/80 prose-code:before:hidden prose-code:after:hidden"
);

export const ArticleProse = ({ children, className, ...rest }: Props) => {
  return (
    <div
      className={cn(
        basicProseClasses,
        "prose-headings:my-4 md:text-lg md:leading-relaxed xl:text-xl xl:leading-loose xl:prose-pre:text-lg",
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

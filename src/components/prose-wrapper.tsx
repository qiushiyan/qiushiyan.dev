import { cn } from "@/lib/utils";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}
export const ProseWrapper = ({ children, className, ...rest }: Props) => {
  return (
    <div
      className={cn(
        "prose-quoteless prose prose-neutral max-w-none dark:prose-invert prose-headings:my-4 prose-a:underline prose-a:underline-offset-8 prose-a:hover:text-primary/80 prose-code:before:hidden prose-code:after:hidden md:text-lg md:leading-relaxed xl:text-xl xl:leading-loose xl:prose-pre:text-lg",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
};

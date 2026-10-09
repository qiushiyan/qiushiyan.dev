import { cn } from "@/lib/utils";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

/** The inline-code chip, shared by plain `code` and highlighted `code-inline`. */
export const inlineCodeClasses =
  "rounded-sm bg-muted px-[0.3em] py-[0.15em] text-[0.875em] font-normal box-decoration-clone";

/*
  The typography plugin's own scale and rhythm, with no size or margin
  overrides: only weights, wrapping, link decoration and the code chip.
*/
export const basicProseClasses = cn(
  "prose max-w-none",
  "prose-headings:font-semibold prose-headings:text-balance prose-h2:tracking-tight prose-h3:tracking-tight",
  "prose-p:text-pretty prose-li:text-pretty",
  "prose-a:font-normal prose-a:decoration-current/40 prose-a:decoration-1 prose-a:underline-offset-[3px]",
  "prose-a:transition-[text-decoration-color] prose-a:duration-150 prose-a:hover:decoration-current",
  "prose-code:rounded-sm prose-code:bg-muted prose-code:px-[0.3em] prose-code:py-[0.15em] prose-code:text-[0.875em] prose-code:font-normal",
  "prose-code:box-decoration-clone prose-code:before:content-none prose-code:after:content-none"
);

/** Long-form text: 16/28 on mobile, 18/32 from `lg`. */
export const ArticleProse = ({ children, className, ...rest }: Props) => {
  return (
    <div className={cn(basicProseClasses, "lg:prose-lg", className)} {...rest}>
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

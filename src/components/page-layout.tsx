import { Container } from "@/components/container";
import { MAIN_CONTENT_ID } from "@/constants";
import { cn } from "@/lib/utils";

/** One centered column, the page's only <main>. Every index page uses it under the nav. */
export function PageMain({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Container>
      <main
        id={MAIN_CONTENT_ID}
        className={cn("mx-auto w-full max-w-2xl py-12 sm:py-16", className)}
      >
        {children}
      </main>
    </Container>
  );
}

export function PageHeader({
  title,
  description,
}: {
  title: string;
  description?: React.ReactNode;
}) {
  return (
    <header>
      <h1 className="text-2xl/8 font-semibold tracking-tight text-balance">
        {title}
      </h1>
      {description && (
        <p className="mt-2 text-base/7 text-pretty text-muted-foreground">
          {description}
        </p>
      )}
    </header>
  );
}

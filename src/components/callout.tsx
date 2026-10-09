import { InfoIcon } from "lucide-react";

import { cn } from "@/lib/utils";

/** `<my-callout title="…">` in Markdown: an aside set off from the body text. */
export const Callout = ({
  title,
  className,
  children,
  ...props
}: React.ComponentProps<"aside"> & { title?: string }) => {
  return (
    <aside
      className={cn(
        "my-6 rounded-lg bg-muted/60 px-5 py-4 [&>:last-child]:mb-0 [&>:nth-child(2)]:mt-0",
        className
      )}
      {...props}
    >
      <p className="not-prose mb-2 flex items-center gap-2 text-[0.875em] font-semibold text-foreground">
        <InfoIcon aria-hidden className="size-4 shrink-0 text-primary" />
        {title ?? "Note"}
      </p>
      {children}
    </aside>
  );
};

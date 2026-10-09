"use client";

import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

/** Editor and output side by side; stacked on phones, where two columns of code are too narrow to read. */
export const RecipesLayout = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const isMobile = useIsMobile();

  return (
    <ResizablePanelGroup
      direction={isMobile ? "vertical" : "horizontal"}
      className={cn("min-h-0 flex-1 rounded-md border", className)}
    >
      {children}
    </ResizablePanelGroup>
  );
};

export const RecipesEditor = ({
  children,
  defaultSize = 50,
}: {
  children: React.ReactNode;
  defaultSize?: number;
}) => {
  return (
    <ResizablePanel defaultSize={defaultSize}>
      <div className="flex h-full flex-col">{children}</div>
    </ResizablePanel>
  );
};

export const RecipesOutput = ({
  children,
  defaultSize = 50,
}: {
  children: React.ReactNode;
  defaultSize?: number;
}) => {
  return (
    <ResizablePanel defaultSize={defaultSize}>
      <div className="flex h-full flex-col">{children}</div>
    </ResizablePanel>
  );
};

/** The label strip at the top of an editor or output panel. */
export const PanelHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="flex h-9 shrink-0 items-center border-b px-3 text-xs font-medium text-muted-foreground">
    {children}
  </div>
);

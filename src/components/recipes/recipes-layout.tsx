import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { cn } from "@/lib/utils";

export const RecipesLayout = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <ResizablePanelGroup
      direction="horizontal"
      className={cn("flex-1 rounded-md border", className)}
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
      <div className="flex h-full flex-col font-mono">{children}</div>
    </ResizablePanel>
  );
};

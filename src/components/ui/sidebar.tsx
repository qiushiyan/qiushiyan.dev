"use client";

import * as React from "react";
import { PanelLeftIcon } from "lucide-react";

import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

type SidebarContext = {
  state: "open" | "closed";
  /** Desktop aside. */
  open: boolean;
  setOpen: (open: boolean) => void;
  /** Mobile sheet. Separate from `open` so a desktop preference never opens a modal on a phone. */
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggle: () => void;
};

const SidebarContext = React.createContext<SidebarContext>({
  state: "open",
  open: true,
  setOpen: () => {},
  openMobile: false,
  setOpenMobile: () => {},
  isMobile: false,
  toggle: () => {},
});

function useSidebar() {
  return React.useContext(SidebarContext);
}

const SidebarLayout = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    defaultOpen?: boolean;
  }
>(({ defaultOpen, className, style, ...props }, ref) => {
  const [open, setOpen] = React.useState(defaultOpen ?? false);
  const [openMobile, setOpenMobile] = React.useState(false);
  const isMobile = useIsMobile();

  const toggle = React.useCallback(() => {
    if (isMobile) setOpenMobile((value) => !value);
    else setOpen((value) => !value);
  }, [isMobile]);

  const state = open ? "open" : "closed";

  return (
    <SidebarContext.Provider
      value={{
        state,
        open,
        setOpen,
        openMobile,
        setOpenMobile,
        isMobile,
        toggle,
      }}
    >
      <div
        ref={ref}
        data-sidebar={state}
        style={{ "--sidebar-width": "16rem", ...style } as React.CSSProperties}
        className={cn("flex min-h-dvh", className)}
        {...props}
      />
    </SidebarContext.Provider>
  );
});
SidebarLayout.displayName = "SidebarLayout";

/** The content beside the desktop aside; it makes room for the aside while it is open. */
const SidebarInset = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex min-w-0 flex-1 flex-col md:pl-(--sidebar-width) md:in-data-[sidebar=closed]:pl-0",
      className
    )}
    {...props}
  />
));
SidebarInset.displayName = "SidebarInset";

const SidebarTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button">
>(({ className, ...props }, ref) => {
  const { open, openMobile, isMobile, toggle } = useSidebar();

  return (
    <button
      ref={ref}
      type="button"
      aria-label="Toggle sidebar"
      aria-expanded={isMobile ? openMobile : open}
      className={cn(
        "grid size-10 place-items-center rounded-md text-muted-foreground transition-[color,scale] duration-150 ease-out hover:text-foreground active:scale-[0.96] max-md:size-11",
        className
      )}
      onClick={toggle}
      {...props}
    >
      <PanelLeftIcon aria-hidden strokeWidth={1.5} className="size-5" />
    </button>
  );
});
SidebarTrigger.displayName = "SidebarTrigger";

const Sidebar = ({
  children,
  className,
  label = "Sidebar",
}: {
  children: React.ReactNode;
  className?: string;
  /** Accessible name for the aside and the mobile sheet. */
  label?: string;
}) => {
  const { isMobile, openMobile, setOpenMobile } = useSidebar();

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile}>
        <SheetContent className="w-65 p-0" side="left">
          <SheetTitle className="sr-only">{label}</SheetTitle>
          <SidebarInner className={className}>{children}</SidebarInner>
        </SheetContent>
      </Sheet>
    );
  }

  // Sits below the sticky nav. While closed it slides out and becomes
  // `invisible`, so its links leave the tab order once the slide finishes.
  return (
    <aside
      aria-label={label}
      className="fixed top-(--nav-height) bottom-0 left-0 z-30 hidden w-(--sidebar-width) transition-[translate,visibility] duration-200 ease-out in-data-[sidebar=closed]:invisible in-data-[sidebar=closed]:-translate-x-full motion-reduce:transition-none md:block"
    >
      <SidebarInner className={className}>{children}</SidebarInner>
    </aside>
  );
};

const SidebarInner = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("flex h-full flex-col border-r bg-background", className)}>
    {children}
  </div>
);

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex flex-1 flex-col gap-6 overflow-auto py-4", className)}
      {...props}
    />
  );
});
SidebarContent.displayName = "SidebarContent";

const SidebarItem = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("grid gap-2 px-2", className)} {...props} />
  );
});
SidebarItem.displayName = "SidebarItem";

const SidebarLabel = React.forwardRef<
  HTMLHeadingElement,
  React.ComponentProps<"h2">
>(({ className, ...props }, ref) => {
  return (
    <h2
      ref={ref}
      className={cn(
        "px-2 text-xs font-medium text-muted-foreground",
        className
      )}
      {...props}
    />
  );
});
SidebarLabel.displayName = "SidebarLabel";

export {
  Sidebar,
  SidebarContent,
  SidebarInset,
  SidebarItem,
  SidebarLabel,
  SidebarLayout,
  SidebarTrigger,
  useSidebar,
};

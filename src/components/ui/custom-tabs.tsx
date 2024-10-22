"use client";

import * as React from "react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

const TabsContext = React.createContext<{
  activeTab: string;
  setActiveTab: (id: string) => void;
} | null>(null);

const Tabs = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    defaultValue?: string;
    onValueChange?: (value: string) => void;
  }
>(({ defaultValue, onValueChange, children, ...props }, ref) => {
  const [activeTab, setActiveTab] = React.useState(defaultValue || "");

  const handleTabChange = React.useCallback(
    (value: string) => {
      setActiveTab(value);
      onValueChange?.(value);
    },
    [onValueChange]
  );

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab: handleTabChange }}>
      <div ref={ref} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
});
Tabs.displayName = "Tabs";

const TabsList = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ ...props }, ref) => (
  <div ref={ref} className="flex space-x-1 pb-2" {...props} />
));
TabsList.displayName = "TabsList";

const TabsTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string }
>(({ className, value, children, ...props }, ref) => {
  const context = React.useContext(TabsContext);
  if (!context) throw new Error("TabsTrigger must be used within Tabs");

  const { activeTab, setActiveTab } = context;
  const isActive = activeTab === value;

  return (
    <button
      ref={ref}
      type="button"
      onClick={() => setActiveTab(value)}
      className={cn(
        "relative px-3 py-2 text-sm font-medium text-foreground outline-sky-400 transition focus-visible:outline-2",
        !isActive && "hover:text-primary/80",
        className
      )}
      style={{
        WebkitTapHighlightColor: "transparent",
      }}
      {...props}
    >
      {isActive && (
        <motion.span
          layoutId="bubble"
          className="absolute inset-0 z-10 rounded-md bg-foreground mix-blend-difference"
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
      {children}
    </button>
  );
});
TabsTrigger.displayName = "TabsTrigger";

const TabsContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value: string }
>(({ value, children, ...props }, ref) => {
  const context = React.useContext(TabsContext);
  if (!context) throw new Error("TabsContent must be used within Tabs");

  const { activeTab } = context;
  if (activeTab !== value) return null;

  return (
    <div ref={ref} {...props}>
      {children}
    </div>
  );
});
TabsContent.displayName = "TabsContent";

export { Tabs, TabsList, TabsTrigger, TabsContent };

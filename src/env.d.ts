interface Window {
  __setTheme: (theme: "light" | "dark" | "system") => void;
}

// Pagefind's component UI stylesheet, imported on first search (src/components/site/site-search.astro).
declare module "@pagefind/component-ui/css";

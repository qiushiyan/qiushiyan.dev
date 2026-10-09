import { MAIN_CONTENT_ID } from "@/constants";

/** Hidden until focused, then overlays the nav instead of pushing it down. */
export const SkipLink = () => (
  <a
    href={`#${MAIN_CONTENT_ID}`}
    className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-4 focus:z-50 focus:rounded-md focus:bg-background focus:px-3 focus:py-2 focus:text-sm focus:font-medium focus:shadow-md"
  >
    Skip to content
  </a>
);

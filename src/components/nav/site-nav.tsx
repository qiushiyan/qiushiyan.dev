import { getSearchIndex } from "@/lib/content/search";
import { SiteNavBar } from "./site-nav-bar";

export function SiteNav({
  additionalControls,
}: {
  /** Page-specific icon buttons, rendered before search (e.g. a sidebar or contents trigger). */
  additionalControls?: React.ReactNode;
}) {
  return (
    <SiteNavBar
      searchEntries={getSearchIndex()}
      additionalControls={additionalControls}
    />
  );
}

import { useSyncExternalStore } from "react";

const MOBILE_QUERY = "(max-width: 767px)";

const subscribe = (onChange: () => void) => {
  const mql = window.matchMedia(MOBILE_QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
};

/**
 * Whether the viewport is below Tailwind's `md` breakpoint. The server snapshot
 * is `false`, so markup that differs on mobile must also be hidden with CSS
 * until hydration.
 */
export function useIsMobile() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(MOBILE_QUERY).matches,
    () => false
  );
}

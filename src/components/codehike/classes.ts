/** The code surface: one bordered box, with the filename and copy button in an optional header row. */
export const codeSurfaceClasses =
  "relative overflow-hidden rounded-lg border bg-(--code-17)";

/** The <pre> inside the surface; also applied at build time (src/lib/content/render-code.tsx). */
export const preClasses =
  "m-0 overflow-x-auto rounded-none bg-transparent px-2 py-3 font-mono text-sm/6";

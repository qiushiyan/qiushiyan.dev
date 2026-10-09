/*
  The typography plugin's own scale and rhythm, with no size or margin
  overrides: only weights, wrapping, link decoration and the code chip.
*/
export const proseClasses = [
  "prose max-w-none",
  "prose-headings:font-semibold prose-headings:text-balance prose-h2:tracking-tight prose-h3:tracking-tight",
  "prose-p:text-pretty prose-li:text-pretty",
  "prose-a:font-normal prose-a:decoration-current/40 prose-a:decoration-1 prose-a:underline-offset-[3px]",
  "prose-a:transition-[text-decoration-color] prose-a:duration-150 prose-a:hover:decoration-current",
  "prose-code:rounded-sm prose-code:bg-muted prose-code:px-[0.3em] prose-code:py-[0.15em] prose-code:text-[0.875em] prose-code:font-normal",
  "prose-code:box-decoration-clone prose-code:before:content-none prose-code:after:content-none",
].join(" ");

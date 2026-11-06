/*
  Weights, wrapping, link decoration and the code chip on top of the
  typography plugin. Size and rhythm are in src/styles/article.css.
*/
export const proseClasses = [
  "prose max-w-none",
  "prose-headings:font-semibold prose-h2:tracking-tight prose-h3:tracking-tight",
  "prose-a:font-normal prose-a:decoration-current/40 prose-a:decoration-(length:--underline-thickness) prose-a:underline-offset-(--underline-offset)",
  "prose-a:transition-[text-decoration-color] prose-a:duration-150 prose-a:hover:decoration-current",
  "prose-code:rounded-sm prose-code:bg-muted prose-code:px-[0.3em] prose-code:py-[0.15em] prose-code:text-[0.875em] prose-code:font-normal",
  "prose-code:box-decoration-clone prose-code:before:content-none prose-code:after:content-none",
].join(" ");

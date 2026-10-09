/**
 * Custom elements in the content that run a client script. Each has a
 * component in src/components/content-elements/ that defines it; a page loads
 * only the scripts for the elements its content uses (recorded per entry by
 * `rehypeCustomElements`). Static custom elements such as <my-callout> become
 * plain HTML at build time instead (see custom-elements.ts).
 */
export const interactiveElements = ["code-switcher", "do-counter-example"] as const;

export type InteractiveElement = (typeof interactiveElements)[number];

export const isInteractiveElement = (name: string): name is InteractiveElement =>
  (interactiveElements as readonly string[]).includes(name);

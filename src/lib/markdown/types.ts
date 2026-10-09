import type { VFile } from "vfile";

/** A unified file inside Astro's Markdown pipeline: plugins add frontmatter fields through `data.astro`. */
export type AstroFile = VFile & {
  data: { astro?: { frontmatter?: Record<string, unknown> } };
};

/** The frontmatter fields this pipeline adds, read by pages from `remarkPluginFrontmatter`. */
export type PipelineFrontmatter = {
  readingTime: number;
  lastModified?: string;
  /** Interactive custom elements the content uses (see elements.ts). */
  elements: string[];
};

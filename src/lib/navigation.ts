import { createNavigationConfig } from "next-safe-navigation";
import { z } from "zod";

export const { routes, useSafeParams, useSafeSearchParams } =
  createNavigationConfig((defineRoute) => ({
    home: defineRoute("/"),
    projects: defineRoute("/projects"),
    project: defineRoute("/projects/[slug]", {
      params: z.object({
        slug: z.string(),
      }),
    }),
    posts: defineRoute("/posts"),
    post: defineRoute("/posts/[slug]", {
      params: z.object({
        slug: z.string(),
      }),
    }),
  }));

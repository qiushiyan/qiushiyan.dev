import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import expressiveCode from "astro-expressive-code";
import pagefind from "astro-pagefind";
import { defineConfig, envField, fontProviders } from "astro/config";

import { expressiveCodeOptions, markdownProcessor } from "./src/lib/markdown";

/*
  A fully static site: `astro build` writes every page to dist/. Nothing in
  src/ runs per request; the only request-time code is the view-count Worker
  in worker/ (see wrangler.jsonc).
*/
export default defineConfig({
  site: "https://qiushiyan.dev",
  // URLs have no trailing slash: /posts/<slug> is served from dist/posts/<slug>.html.
  trailingSlash: "never",
  build: { format: "file" },
  devToolbar: { enabled: false },
  prefetch: { prefetchAll: true, defaultStrategy: "hover" },
  integrations: [
    // The recipe editor is the only React island.
    react(),
    expressiveCode(expressiveCodeOptions),
    // Indexes the built pages for site search (src/components/site/site-search.astro).
    pagefind(),
  ],
  markdown: { syntaxHighlight: false, processor: markdownProcessor },
  env: {
    schema: {
      // Optional: raises the GitHub API rate limit for the home page's repository stats.
      GITHUB_TOKEN: envField.string({
        context: "server",
        access: "secret",
        optional: true,
      }),
    },
  },
  fonts: [
    {
      provider: fontProviders.google(),
      name: "Geist",
      cssVariable: "--font-geist-sans",
      weights: ["400 700"],
      fallbacks: ["ui-sans-serif", "system-ui", "sans-serif"],
    },
    {
      provider: fontProviders.google(),
      name: "JetBrains Mono",
      cssVariable: "--font-jetbrains-mono",
      weights: ["400 700"],
      fallbacks: ["ui-monospace", "monospace"],
    },
  ],
  vite: {
    plugins: [tailwindcss()],
    // The recipe editor island (CodeMirror + react-py) is ~520 KB and loads on recipe pages only.
    build: { chunkSizeWarningLimit: 600 },
  },
});

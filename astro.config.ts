import { unified } from "@astrojs/markdown-remark";
import react from "@astrojs/react";
import { pluginCollapsibleSections } from "@expressive-code/plugin-collapsible-sections";
import tailwindcss from "@tailwindcss/vite";
import expressiveCode from "astro-expressive-code";
import { defineConfig, fontProviders } from "astro/config";
import rehypeRaw from "rehype-raw";
import remarkHeadingAttrs from "remark-heading-attrs";
import remarkUnwrapImages from "remark-unwrap-images";

import { pluginCodeHikeAnnotations } from "./src/lib/content/code-annotations";
import { codeThemeDark, codeThemeLight } from "./src/lib/content/code-themes";
import {
  rehypeCodeMeta,
  rehypeCodeSwitcher,
  rehypeCustomElements,
  rehypeInlineCode,
  remarkArticleMetadata,
  remarkCloseCustomElements,
  remarkRawImages,
} from "./src/lib/content/markdown";

export default defineConfig({
  site: "https://qiushiyan.dev",
  trailingSlash: "never",
  build: { format: "file" },
  // Every page is static. The view-count API is a plain Worker in front of
  // the static assets (worker/index.ts, wrangler.jsonc), not an Astro route.
  devToolbar: { enabled: false },
  prefetch: { prefetchAll: true, defaultStrategy: "hover" },
  integrations: [
    react(),
    expressiveCode({
      themes: [codeThemeLight, codeThemeDark],
      // The site's theme is a `.dark` class on <html>, set by the theme toggle.
      themeCssSelector: (theme) => (theme.type === "dark" ? ".dark" : false),
      useDarkModeMediaQuery: false,
      // The palette is already 4.5:1 or better; don't let EC shift it.
      minSyntaxHighlightingColorContrast: 0,
      plugins: [pluginCollapsibleSections(), pluginCodeHikeAnnotations()],
      defaultProps: { collapseStyle: "collapsible-start" },
      styleOverrides: {
        borderRadius: "0.5rem",
        borderColor: "var(--color-border)",
        codeFontFamily: "var(--font-mono)",
        codeFontSize: "0.875rem",
        codeLineHeight: "1.5rem",
        codePaddingBlock: "0.75rem",
        codePaddingInline: "1rem",
        uiFontFamily: "var(--font-mono)",
        uiFontSize: "0.875rem",
        // The filename sits in a plain header row on the code surface, as before.
        frames: {
          shadowColor: "transparent",
          frameBoxShadowCssValue: "none",
          editorTabBarBackground: ({ theme }) => theme.colors["editor.background"],
          editorActiveTabBackground: ({ theme }) => theme.colors["editor.background"],
          editorActiveTabForeground: "var(--color-muted-foreground)",
          editorActiveTabBorderColor: "transparent",
          editorActiveTabIndicatorTopColor: "transparent",
          editorActiveTabIndicatorBottomColor: "transparent",
          editorTabBarBorderBottomColor: "var(--color-border)",
          editorTabBorderRadius: "0",
          editorTabsMarginInlineStart: "0.25rem",
        },
        // Folded ranges read as a muted summary line, like Code Hike's "… N lines".
        collapsibleSections: {
          closedBackgroundColor: "transparent",
          closedBorderColor: "transparent",
          closedTextColor: "var(--color-muted-foreground)",
          openBackgroundColorCollapsible: "transparent",
        },
        // Code Hike's mark: a sky accent bar and a faint sky wash.
        textMarkers: {
          markBackground: "rgb(14 165 233 / 0.1)",
          markBorderColor: "rgb(14 165 233)",
          lineMarkerAccentWidth: "2px",
        },
      },
    }),
  ],
  markdown: {
    syntaxHighlight: false,
    processor: unified({
      // Quarto already writes typographic quotes and dashes.
      smartypants: false,
      remarkPlugins: [
        remarkHeadingAttrs,
        remarkRawImages,
        remarkCloseCustomElements,
        remarkUnwrapImages,
        remarkArticleMetadata,
      ],
      // Astro parses raw HTML only after these run; the custom elements need it first.
      rehypePlugins: [
        rehypeRaw,
        rehypeCodeSwitcher,
        rehypeCodeMeta,
        rehypeCustomElements,
        rehypeInlineCode,
      ],
    }),
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
  },
});

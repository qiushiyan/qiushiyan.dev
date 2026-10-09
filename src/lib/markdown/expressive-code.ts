import { pluginCollapsibleSections } from "@expressive-code/plugin-collapsible-sections";

import { pluginCodeHikeAnnotations } from "./code-annotations";
import { codeThemeDark, codeThemeLight } from "./code-themes";
import type { AstroExpressiveCodeOptions } from "astro-expressive-code";

/*
  Expressive Code renders every fenced code block. After changing these
  options, delete .astro/ and node_modules/.astro/: Astro's content cache
  doesn't notice, and cached pages keep linking the old ec.*.css.
*/
export const expressiveCodeOptions: AstroExpressiveCodeOptions = {
  themes: [codeThemeLight, codeThemeDark],
  // The site's theme is a `.dark` class on <html>, set by the theme script.
  themeCssSelector: (theme) => (theme.type === "dark" ? ".dark" : false),
  useDarkModeMediaQuery: false,
  // The palette is already 4.5:1 or better; don't let Expressive Code shift it.
  minSyntaxHighlightingColorContrast: 0,
  // The annotations plugin hands collapsed ranges to the collapsible plugin, so it comes after it.
  plugins: [pluginCollapsibleSections(), pluginCodeHikeAnnotations()],
  // Shell blocks get the plain code frame too, not a terminal window.
  defaultProps: { collapseStyle: "collapsible-start", frame: "code" },
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
    // The filename sits in a plain header row on the code surface.
    frames: {
      shadowColor: "transparent",
      frameBoxShadowCssValue: "none",
      editorTabBarBackground: ({ theme }) => theme.colors["editor.background"],
      editorActiveTabBackground: ({ theme }) =>
        theme.colors["editor.background"],
      editorActiveTabForeground: "var(--color-muted-foreground)",
      editorActiveTabBorderColor: "transparent",
      editorActiveTabIndicatorTopColor: "transparent",
      editorActiveTabIndicatorBottomColor: "transparent",
      editorTabBarBorderBottomColor: "var(--color-border)",
      editorTabBorderRadius: "0",
      editorTabsMarginInlineStart: "0.25rem",
    },
    // Folded ranges read as a muted summary line.
    collapsibleSections: {
      closedBackgroundColor: "transparent",
      closedBorderColor: "transparent",
      closedTextColor: "var(--color-muted-foreground)",
      openBackgroundColorCollapsible: "transparent",
    },
    // A sky accent bar and a faint sky wash, as Code Hike's marks had.
    textMarkers: {
      markBackground: "rgb(14 165 233 / 0.1)",
      markBorderColor: "rgb(14 165 233)",
      lineMarkerAccentWidth: "2px",
    },
  },
};

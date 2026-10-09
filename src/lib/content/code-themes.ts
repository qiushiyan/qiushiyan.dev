import { tailwindCodeTheme } from "./tailwind-code-theme";

/*
  The site's two code themes. The token scopes come from tailwind-code-theme.ts,
  which names colours `var(--code-N)`; these palettes fill them in. Expressive
  Code and Shiki compute contrast and backgrounds from real colours, so each
  theme carries concrete values instead of CSS variables.

  Every token colour is at least 4.5:1 on the code surface (17), on marked
  lines, and on the inline-code chip, in both themes.
*/

const light: Record<number, string> = {
  1: "#5f6f86", // comments (R output lines are comments)
  2: "#c2410c", // constants, booleans, enums, types, headings
  3: "#314158", // entity names, variable defs
  4: "#1d293d", // foreground
  5: "#9810fa", // functions
  6: "#0369a1", // tags, components, JSON props, inserted
  7: "#155dfc", // keywords, storage, embedded
  8: "#432dd7", // strings, regexp, links
  9: "#c70036", // invalid, errors
  10: "#45556c", // support, property-names
  11: "#5f6f86", // brackets
  17: "#ffffff", // editor bg
  18: "#e2e8f080", // line highlight
  19: "#155dfc1a", // range highlight
  20: "#2b7fff", // info fg
  21: "#bedbff", // selection bg
  22: "#00a6f4", // focus border
  23: "#f8fafc", // tab inactive bg
  24: "#e2e8f0", // borders
  25: "#90a1b9", // line numbers
  26: "#62748e33", // list selection bg
  27: "#f1f5f9e6", // inline code bg
};

const dark: Record<number, string> = {
  1: "#8b949e",
  2: "#79c0ff",
  3: "#ffa657",
  4: "#c9d1d9",
  5: "#d2a8ff",
  6: "#7ee787",
  7: "#ff7b72",
  8: "#a5d6ff",
  9: "#ffa198",
  10: "#79c0ff",
  11: "#8b949e",
  // A slight lift off the page background (hsl 220 16% 5%), same hue
  17: "#121317",
  18: "#6e76811a",
  19: "#ffffff0b",
  20: "#3794ff",
  21: "#264f78",
  22: "#1f6feb",
  23: "#010409",
  24: "#30363d",
  25: "#6e7681",
  26: "#6e768166",
  27: "#0d1117e6",
};

const resolve = (palette: Record<number, string>) => (value: string) =>
  value.replace(/var\(--code-(\d+)\)/g, (_, n: string) => palette[Number(n)]);

const build = (name: string, type: "light" | "dark", palette: Record<number, string>) => {
  const color = resolve(palette);
  return {
    name,
    type,
    colors: Object.fromEntries(
      Object.entries(tailwindCodeTheme.colors).map(([key, value]) => [key, color(value)])
    ),
    tokenColors: tailwindCodeTheme.tokenColors.map((rule) => ({
      ...rule,
      settings: {
        ...rule.settings,
        ...(rule.settings.foreground && { foreground: color(rule.settings.foreground) }),
      },
    })),
  };
};

export const codeThemeLight = build("site-light", "light", light);
export const codeThemeDark = build("site-dark", "dark", dark);

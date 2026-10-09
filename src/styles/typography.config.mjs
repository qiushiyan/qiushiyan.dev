/*
  @tailwindcss/typography overrides, loaded from globals.css with `@config`.

  This is the one piece of the Tailwind setup that stays in JavaScript: the
  plugin only accepts raw-CSS customisation through the JS theme API (see the
  plugin README, "Customizing the CSS"). It also has to stay inside the
  plugin's own `.prose` rule: Tailwind v4 sorts utilities by the CSS
  properties they contain, and the `margin` below is what keeps `.prose`
  ahead of the `m-*` / `mx-*` / `my-*` utilities, so those utilities still win
  over prose element styles (e.g. `my-0` on a code block's <pre>). Moving these
  overrides into plain CSS changes that order and visibly breaks code blocks.
*/

/** @type {import("tailwindcss").Config} */
const config = {
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            "--tw-prose-body": "hsl(var(--foreground))",
            "--tw-prose-headings": "hsl(var(--foreground))",
            "--tw-prose-lead": "hsl(var(--muted-foreground))",
            /*
              Links are body text and need 4.5:1. The light primary is 3.9:1
              on the page, so links mix a fifth of the foreground into it:
              a darker step of the same hue in light mode (5.1:1), and a
              slightly lighter one in dark mode (12.5:1).
            */
            "--tw-prose-links":
              "color-mix(in srgb, hsl(var(--primary)) 80%, hsl(var(--foreground)))",
            "--tw-prose-bold": "hsl(var(--foreground))",
            "--tw-prose-counters": "hsl(var(--muted-foreground))",
            "--tw-prose-bullets": "hsl(var(--muted-foreground))",
            "--tw-prose-hr": "hsl(var(--border))",
            "--tw-prose-quotes": "hsl(var(--foreground))",
            "--tw-prose-quote-borders": "hsl(var(--border))",
            "--tw-prose-captions": "hsl(var(--muted-foreground))",
            "--tw-prose-code": "hsl(var(--foreground))",
            "--tw-prose-th-borders": "hsl(var(--border))",
            "--tw-prose-td-borders": "hsl(var(--border))",
            p: {
              "+ ul": {
                margin: "0px",
              },
            },
          },
        },
      },
    },
  },
};

export default config;

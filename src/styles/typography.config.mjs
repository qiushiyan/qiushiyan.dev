/*
  @tailwindcss/typography overrides, loaded from globals.css with `@config`.

  This is the one piece of the Tailwind setup that stays in JavaScript: the
  plugin only accepts raw-CSS customisation through the JS theme API (see the
  plugin README, "Customizing the CSS"). It also has to stay inside the
  plugin's own `.prose` rule: Tailwind v4 sorts utilities by the CSS
  properties they contain, and the `margin` below is what keeps `.prose`
  ahead of the `m-*` / `mx-*` / `my-*` utilities, so those utilities still win
  over prose element styles. Moving these overrides into plain CSS changes that
  order and shifts the layout of posts.
*/

/** @type {import("tailwindcss").Config} */
const config = {
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            "--tw-prose-body": "var(--color-foreground)",
            "--tw-prose-headings": "var(--color-foreground)",
            "--tw-prose-lead": "var(--color-muted-foreground)",
            /*
              Links are body text and need 4.5:1. The light primary is 3.9:1
              on the page, so links mix a fifth of the foreground into it:
              a darker step of the same hue in light mode (5.1:1), and a
              slightly lighter one in dark mode (12.5:1).
            */
            "--tw-prose-links":
              "color-mix(in srgb, var(--color-primary) 80%, var(--color-foreground))",
            "--tw-prose-bold": "var(--color-foreground)",
            "--tw-prose-counters": "var(--color-muted-foreground)",
            "--tw-prose-bullets": "var(--color-muted-foreground)",
            "--tw-prose-hr": "var(--color-border)",
            "--tw-prose-quotes": "var(--color-foreground)",
            "--tw-prose-quote-borders": "var(--color-border)",
            "--tw-prose-captions": "var(--color-muted-foreground)",
            "--tw-prose-code": "var(--color-foreground)",
            "--tw-prose-th-borders": "var(--color-border)",
            "--tw-prose-td-borders": "var(--color-border)",
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

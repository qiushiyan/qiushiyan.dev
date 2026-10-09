# CLAUDE.md

This is a personal website built with Astro 7 with Tailwind v4, built to static files and served by Cloudflare Workers Static Assets; one small Worker in front of them counts post views in D1. Content contains post, notes and code recipes

There is no staging suite. A change is verified by `pnpm build` (it lists every page), `pnpm check`, `pnpm lint`, and `pnpm preview` for anything touching the Worker, headers or D1.

`astro dev` detaches into the background when it detects a coding agent; `ASTRO_DEV_BACKGROUND=0` keeps it in the foreground, and `astro dev stop` ends a detached one.

Deploys run on Cloudflare Workers Builds, whose dashboard calls `pnpm cf:build`, `pnpm cf:deploy` (for `main`) and `pnpm cf:upload` (other branches), so `package.json` decides what each does. Builds need a full clone: `lastModified` comes from git.

## Rendering model

Every page is a static file. Astro builds with no adapter, so a route with `prerender = false` fails the build (`NoAdapterInstalled`): pages cannot read request data or D1. The only request-time code is `worker/index.ts`, and `wrangler.jsonc` routes to it with `run_worker_first: ["/api/*"]`; every other request is a static-asset hit that never runs the Worker, and an unknown path gets `dist/404.html`.

- **Per-visitor state lives in small client scripts:** the view count, the `/posts?tag=` filter, the theme and search.
- **URLs have no trailing slash:** `build.format: "file"` writes `dist/posts/<slug>.html`, which Workers Static Assets serves at `/posts/<slug>`. Public URLs are inbound links and feed GUIDs, so they don't change.

**View counts:**

- `<view-count>` (`src/components/article/view-count.astro`) posts once per browser session to `/api/views/:slug`.
- The Worker accepts a slug only if `ASSETS` has a page at `/posts/<slug>` (drafts are never built), then checks same-origin and the `VIEWS_RATE_LIMITER` binding, and upserts D1 `post_views`.
- Schema changes are new SQL files in `migrations/`, applied with `wrangler d1 migrations`.

## Content pipeline

```
quarto-contents/**/index.qmd  --pnpm quarto-->  content/**/index.md
content/  --collections (src/content.config.ts)-->  Markdown pipeline (src/lib/markdown/)  -->  HTML in Astro's content store
page  --render(entry)-->  <Content />
```

- **Posts and notes are Quarto output.** The `.qmd` is the source; the generated `.md` also carries rendered code output and a `headings` frontmatter list produced by Quarto filters. Quarto and R are usually not installed, so a prose fix goes into both files, identically. In knitr chunks, `class-output` assigns a language to text output.
- **Read content through `src/lib/content/*`** (`getPosts`, `getNotes`, `getRecipes`, …): it hides drafts in production. Collections are `posts` and `notes` (Markdown) and `recipes` (`content/recipes/index.yaml` plus the source files).
- **The Markdown pipeline is remark/rehype under `unified()`** from `@astrojs/markdown-remark`; Astro 7's default processor (Sätteri) doesn't run remark or rehype plugins. The plugin order is in `src/lib/markdown/index.ts`, and `rehype-raw` runs first because Quarto's custom elements are raw HTML. It runs in Node during content sync and adds `readingTime`, `lastModified` and `elements` to each entry's frontmatter (`src/lib/markdown/types.ts`).
- **Code blocks render with Expressive Code** (`src/lib/markdown/expressive-code.ts`), using the site's light and dark code themes. Authoring syntax:
  - Leading `#| filename:` / `#| caption:` lines become the frame title and a caption. Other `#|` lines, such as Quarto chunk options, stay visible as code.
  - Code Hike's comment annotations `!mark(a:b)`, `!collapse(a:b)` (optionally `collapsed`) and `!callout[/regex/] text` (optionally `:right`). `src/lib/markdown/code-annotations.ts` translates them, using Expressive Code internals: after upgrading Expressive Code, check posts that use each annotation.
  - Highlighted inline code is written ``_py`code`_``; Shiki renders it (`src/lib/markdown/inline.ts`).
  - `<code-switcher>` around several fenced blocks becomes tabs.
- **Custom elements in content are static or interactive.**
  - Static ones (`<my-callout>`, `<my-steps>`, `<iframe>`, images) become plain HTML at build (`src/lib/markdown/custom-elements.ts`).
  - Interactive ones are listed in `src/lib/markdown/elements.ts`. Each has a script component in `src/components/content-elements/`, and a page loads only the scripts its entry uses. A new one needs an entry in both. The build warns about an unknown hyphenated tag.
  - The `components:` frontmatter in some posts is a leftover nothing reads.
- **Images** in Markdown, including Quarto's raw `<img>` tags, are resized and fingerprinted by `astro:assets` at build.
- **`lastModified` is the file's last git commit,** so any commit touching a post bumps its "Updated" date.
- **After changing Expressive Code options, delete `.astro/` and `node_modules/.astro/`.** Astro's content cache doesn't notice the change, and cached pages keep linking an `ec.*.css` that dev answers with a 404.

## Where things live

- **Layouts:**
  - `src/layouts/base-layout.astro`: the HTML shell, metadata and nav.
  - `page-layout.astro`: index pages.
  - `article-layout.astro`: posts and notes. It renders the entry, its table of contents and the content-element scripts, and marks the body for search.
- **Components by area:** `site/` (nav, theme, search, analytics), `article/`, `lists/`, `post/`, `recipe/`, `content-elements/`.
- **Interactivity:**
  - Pages are static HTML with small inline scripts, usually a custom element.
  - The recipe editor (CodeMirror plus react-py, `client:only`) is the only React island.
  - Prefer a custom element for new interactive pieces.
- **Search:**
  - Pagefind indexes elements marked `data-pagefind-body` (the article bodies) at build.
  - The nav button imports Pagefind's UI on first use.
  - `astro dev` serves the last build's index.
- **OG cards:** `src/pages/og/[...card].png.ts` renders one PNG per page at build with satori and resvg; pages name theirs with `BaseLayout`'s `ogCard`.
- **Feed and sitemap:**
  - `/feed.xml` item GUIDs are the slashless post URLs. `@astrojs/rss` would add a trailing slash, which makes readers show every post as new, so `trailingSlash: false` stays.
  - `/sitemap.xml` is a small endpoint, so it can carry git dates.
- **Comments:** Giscus finds each post's discussion by `og:title`, so keep a post's `og:title` its bare title.
- **Theme:**
  - An inline pre-paint script (`src/components/site/theme-script.astro`) sets the `.dark` class on `<html>` from `localStorage.theme`.
  - It dispatches `themechange` for widgets that follow the theme (Giscus, the recipe editor).
- **Shared values:** site identity in `src/lib/site.ts`, routes in `src/lib/navigation.ts`. Dates go through `formatDate` (`src/lib/format.ts`), in UTC so builds don't depend on the machine's time zone.

## Styling

- **`src/styles/globals.css` holds the whole Tailwind v4 config:** CSS-first design tokens for light and `.dark`. Dark mode is the `.dark` class (`@custom-variant dark`), not the OS media query.
- **Typography-plugin overrides stay in `src/styles/typography.config.mjs` through `@config`.** Moving them to CSS reorders `.prose` against spacing utilities; the file header explains why.
- **The article column, margin notes and TOC rail** are plain CSS in `src/styles/article.css`. `src/styles/content.css` styles the HTML the Markdown pipeline produces and the site's look for Expressive Code blocks.
- **Code colours** are the light and dark themes in `src/lib/markdown/code-themes.ts`, built from the palette in `tailwind-code-theme.ts`. Keep every token at 4.5:1 contrast or better in both themes.
- **Design direction:**
  - Quiet chrome and text-first lists.
  - One accent hue in both themes.
  - Motion only in response to input, never on content entrance. Page-to-page title morphs are native cross-document view transitions (`@view-transition` in `globals.css`), with no client router.

## Conventions

Commit on main without prs directly unless asked otherwise, push is left with the user.

Named exports, lowercase-dash file names, `.astro` components by default, and comments only where they explain why.

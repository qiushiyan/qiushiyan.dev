# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Qiushi Yan's personal site: posts, notes and code recipes. Next.js 16 App Router, React 19, Tailwind v4, deployed to Cloudflare Workers through OpenNext, with D1 holding post view counts.

## Commands

```bash
pnpm dev                 # Next dev server; also runs Velite in watch mode
pnpm build               # Velite + next build (prints the route table)
pnpm exec tsc --noEmit   # typecheck; needs .velite/, so run after dev or build
pnpm lint                # eslint .
pnpm preview             # OpenNext Worker build, served locally by wrangler
pnpm db:migrate:local    # apply migrations/ to local D1 (needed for view counts in dev/preview)
pnpm cf-typegen          # regenerate worker-configuration.d.ts after editing wrangler.jsonc bindings
pnpm spellcheck          # prose spell check over content/
```

There is no test suite. A change is verified by `pnpm build` (check the route table), `tsc`, `lint`, and `pnpm preview` for anything touching the Worker, caching or D1.

Deploys run on Cloudflare Workers Builds; its settings live in the dashboard, not in this repo. Every command there goes through OpenNext: `opennextjs-cloudflare build` builds, `opennextjs-cloudflare deploy` deploys `main`, and `opennextjs-cloudflare upload` uploads versions for other branches. Plain `wrangler deploy` or `wrangler versions upload` skips copying prerendered pages into static assets, so every cached page misses.

## Rendering model

Every page is prerendered at build time, and OpenNext serves it from Workers Static Assets through a read-only incremental cache (`open-next.config.ts`). Nothing revalidates; content changes on deploy. The only dynamic route is `src/app/api/views/[slug]`.

What keeps it that way:
- **Pages never read request data or D1 while rendering:** no `cookies()`, `headers()`, `searchParams` or `getCloudflareContext()`. Per-visitor state lives in client islands: view counts, `/posts` tag filtering via `?tag=`, and theme.
- **Dynamic segments export `generateStaticParams` with `dynamicParams = false`.** This includes the `opengraph-image.tsx` files, which don't inherit the page's params, so unknown slugs and production drafts 404.
- **A route that renders per request also renders on every request,** because the cache is read-only. Anything that needs runtime caching needs a writable incremental cache, e.g. R2.

**View counts:**
- `PostViewCount` posts once per browser session to `/api/views/[slug]`.
- The handler checks that the slug is a published post, that the request is same-origin, and the `VIEWS_RATE_LIMITER` binding, then upserts into D1 `post_views` (`src/lib/server/views.ts`).
- Schema changes are new SQL files in `migrations/`, applied with `wrangler d1 migrations`.

## Content pipeline

```
quarto-contents/**/index.qmd  --pnpm quarto-->  content/**/index.md
content/  --Velite (velite.config.ts)-->  .velite/*.json   (imported as "#content")
          remark/rehype plugins in src/lib/content/ highlight code and render it to HTML
page  --HtmlRenderer (htmr)-->  React, custom tags mapped by src/components/components-registry.tsx
```

- **Posts and notes are Quarto output.** The `.qmd` is the source; the generated `.md` also carries rendered code output and a `headings` frontmatter list produced by Quarto filters. Quarto and R are usually not installed, so a prose fix goes into both files, identically. In knitr chunks, `class-output` assigns a language to text output.
- **Code highlighting runs only at build time.** CodeHike's highlighter needs WASM, which Workers can't run. `rehype-code.ts` highlights with CodeHike and `render-code.tsx` renders blocks to static HTML. Runtime components only decode and display that HTML. Block attributes are base64-encoded because htmr double-decodes entities (`src/components/codehike/encoding.ts`).
- **Authoring syntax in code blocks:**
  - Leading `#| filename:` / `#| caption:` lines become block metadata. Other `#|` lines, such as Quarto chunk options, stay visible as code.
  - Comment annotations `!mark`, `!collapse` and `!callout` (CodeHike).
  - Highlighted inline code is written `` _py`code`_ ``.
- **Custom elements** in Markdown (`<my-callout>`, `<my-steps>`, `<code-switcher>`, demo widgets) render through the component registry. Heavy or client-side ones load only when the entry's frontmatter `components` list names them.
- **`lastModified` is the file's last git commit,** so builds need a full clone, and any commit touching a post bumps its "Updated" date.
- **Changes to `velite.config.ts` or the plugins need a dev-server restart.** The watcher reloads content, not config.

## Content access boundary

Read content through `src/lib/content/*` (`getPosts`, `getPost`, `getNotes`, `getSearchIndex`, …): it filters drafts in production and is `server-only`, so importing it from client code fails the build. Client components receive the fields they render as props from a server parent. Importing `#content` directly in client code compiles but ships every post's HTML to the browser.

Site identity (name, URL, social links) is in `src/lib/site.ts`, routes in `src/lib/navigation.ts`, and dates go through `formatDate` (`src/lib/format.ts`, UTC so prerendered output doesn't depend on the build machine).

## Styling

- **`src/styles/globals.css` holds the whole Tailwind v4 config:** CSS-first design tokens for light and `.dark`. Dark mode is the `.dark` class set by next-themes (`@custom-variant dark`), not the OS media query.
- **Typography-plugin overrides stay in `src/styles/typography.config.mjs` through `@config`.** Moving them to CSS reorders `.prose` against spacing utilities and breaks code blocks; the file header explains why.
- **The article column, margin notes and TOC rail** are plain CSS in `src/styles/article.css`.
- **Code token colours** are CSS variables in `src/styles/highlight.css`, mapped by `src/lib/content/tailwind-code-theme.ts`. Keep every token at 4.5:1 contrast or better in both themes.
- **Design direction:**
  - Quiet chrome and text-first lists.
  - One accent hue in both themes.
  - Motion only in response to input, never on content entrance.

## Version pins and patches

- **Next 16.3:** 16.4 returns 500 on every route under `@opennextjs/cloudflare` 1.20 until opennext PR #1356 ships.
- **TypeScript 6:** typescript-eslint doesn't support TS 7.
- **ESLint 9:** `eslint-plugin-react` crashes on ESLint 10.
- **pnpm patches and build-script approvals** live in `pnpm-workspace.yaml`.
  - The `@code-hike/lighter` patch adds the `workerd` export condition.
  - The `htmr` patch points its browser entry at the shared parser.

## Conventions

Named exports, server components by default, `cn()` for class merging, lowercase-dash directories, and comments only where they explain why. Shadcn primitives live in `src/components/ui/` (`pnpm shadcn` adds more).

If the dev server dies with a Turbopack `turbo-tasks` panic, delete `.next/dev` and restart it.

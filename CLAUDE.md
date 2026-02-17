# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev              # Next.js dev server (auto-runs Velite build)
pnpm build            # Production build (Velite + Next.js)
pnpm preview          # Build for Cloudflare + run locally via wrangler
pnpm deploy           # Build for Cloudflare + deploy to production
pnpm lint             # ESLint
pnpm format           # Prettier

# Database (Cloudflare D1 via Drizzle)
pnpm db:generate              # Generate Drizzle migrations
pnpm db:migrate:local         # Apply migrations to local D1
pnpm db:migrate:prod          # Apply migrations to remote D1
pnpm db:studio:local          # Open Drizzle Studio (local)
```

## Architecture

### Stack
Next.js 15 (App Router) + React 19 + TypeScript, deployed to **Cloudflare Workers** via OpenNext (`@opennextjs/cloudflare`). Database is Cloudflare D1 (SQLite) via Drizzle ORM. Styling with Tailwind CSS 3 + Shadcn UI/Radix primitives.

### Content Pipeline

This is the most important architectural concept. Content flows through multiple stages:

```
Markdown (content/)
  → Velite build (velite.config.ts)
    → Remark plugins (directives, image unwrapping)
    → Rehype plugins (src/lib/content/plugins.ts)
      → Transforms <pre><code> → <code-block value="..." lang="..." highlighted="...">
      → Transforms inline code → <code-inline value="..." lang="..." highlighted="...">
      → Pre-highlights at build time via CodeHike (WASM, Node.js only)
    → HTML string output in .velite/
  → Next.js imports via "#content" path alias
  → HtmlRenderer (htmr) converts HTML string → React components
  → Component registry (src/components/components-registry.tsx) maps custom HTML tags to React
```

**Critical constraint:** CodeHike's `highlight()` function uses WASM (`vscode-oniguruma`) which cannot run on Cloudflare Workers. All syntax highlighting is pre-computed at Velite build time and serialized as JSON in HTML attributes. Runtime components (`CodeBlock`, `InlineCode`, `CodeSwitcher`) parse this JSON — they must never call `highlight()` at runtime.

### Content Collections (Velite)

Defined in `velite.config.ts`. Source files in `content/`:
- **Posts** (`content/posts/*.md`) — blog posts with tags, descriptions, draft support
- **Notes** (`content/notes/*.md`) — shorter technical notes
- **Recipes** (`content/recipes/index.yaml`) — code snippets grouped by language
- **About** (`content/about.md`) — single page

Content is accessed via `#content` path alias (maps to `.velite/`):
```typescript
import { posts, notes, recipes } from "#content";
```

Content helpers with filtering/sorting live in `src/lib/content/` (e.g., `getPosts()`, `findPost()`).

### Code Highlighting (CodeHike)

CodeHike components live in `src/components/codehike/`. Key files:
- `code-block.tsx` — main code block renderer, uses pre-highlighted JSON
- `inline-code.tsx` — inline syntax highlighting
- `code-switcher.tsx` — multi-language tabbed code blocks
- `handlers.ts` — annotation handlers (focus, mark, hover, callout, collapse, etc.)

The theme is `github-from-css` with CSS variables defined in `src/styles/highlight.css` (light/dark).

Markdown code blocks support metadata comments:
```
#|filename: example.py
#|caption: A description
#|ref: footnote-label
```

### Custom Markdown Directives

Via `remark-directive` + custom `remarkUseDirective` plugin:
```markdown
:::my-callout
Content here
:::
```
Mapped to React components in `src/components/components-registry.tsx`.

### Database

Minimal schema — only `postViews` table for view counting. Uses `getCloudflareContext()` from OpenNext to access the D1 binding. Server Actions in `src/actions/` handle writes.

### Rendering Modes

- **Static** (`○`): `/about`, `/notes`, `/recipes`, `/projects/qlang`
- **SSG** (`●`): `/recipes/[group]/[slug]` (has `generateStaticParams`)
- **Dynamic** (`ƒ`): `/`, `/posts`, `/posts/[slug]`, `/notes/[slug]`

Posts/notes are dynamic because the post layout reads cookies (sidebar state) and increments view counts.

## Conventions

- **Named exports** for components (not default exports)
- **Lowercase-dash directories** (e.g., `components/post-example/`)
- **Server Components by default** — only use `"use client"` for interactive features
- **Functional/declarative patterns** — no classes
- Path alias `@/*` maps to `src/*`
- Routes centralized in `src/lib/navigation.ts`
- Environment variables validated via Zod in `src/env.mjs`
- Shadcn UI components in `src/components/ui/` — Radix-based
- Responsive design via Fluid Tailwind (`~text-base/lg` syntax)

## Patched Dependencies

In `patches/`:
- `@code-hike/lighter@1.0.1` — adds `workerd` export condition
- `htmr@1.0.2` — fixes React type imports for newer React versions

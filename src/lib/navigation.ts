export const routes = {
  home: "/",
  posts: "/posts",
  about: "/about",
  notes: "/notes",
  recipes: "/recipes",
  note: (slug: string) => `/notes/${slug}`,
  post: (slug: string) => `/posts/${slug}`,
  recipe: (group: string, slug: string) => `/recipes/${group}/${slug}`,
  feed: "/feed.xml",
  /** The Open Graph card for a page, e.g. `og("posts/durable-object-chat")` (src/pages/og/[...card].png.ts). */
  og: (card: string) => `/og/${card}.png`,
};

/** The site's primary sections, in nav order (desktop bar and mobile menu). */
export const navLinks = [
  { href: routes.posts, label: "Posts" },
  { href: routes.notes, label: "Notes" },
  { href: routes.recipes, label: "Recipes" },
  { href: routes.about, label: "About" },
] as const;

/** A page's public path. With `build.format: "file"`, a build sees `/index.html` and `/posts.html` where dev sees `/` and `/posts`. */
export const publicPath = (pathname: string) => pathname.replace(/(\/index)?\.html$/, "") || "/";

/** Whether `href` is the current section: the page itself or any page under it. */
export const isActivePath = (pathname: string, href: string) =>
  pathname === href || pathname.startsWith(`${href}/`);

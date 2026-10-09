export const routes = {
  home: "/",
  posts: "/posts",
  about: "/about",
  notes: "/notes",
  recipes: "/recipes",
  note: (slug: string) => `/notes/${slug}`,
  post: (slug: string) => `/posts/${slug}`,
  recipe: (lang: string, slug: string) => `/recipes/${lang}/${slug}`,
};

/** The site's primary sections, in nav order (desktop bar and mobile menu). */
export const navLinks = [
  { href: routes.posts, label: "Posts" },
  { href: routes.notes, label: "Notes" },
  { href: routes.recipes, label: "Recipes" },
  { href: routes.about, label: "About" },
] as const;

/** Whether `href` is the current section: the page itself or any page under it. */
export const isActivePath = (pathname: string, href: string) =>
  pathname === href || pathname.startsWith(`${href}/`);

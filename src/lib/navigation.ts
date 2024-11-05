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

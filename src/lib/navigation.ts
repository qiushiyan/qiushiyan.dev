export const routes = {
  home: "/",
  posts: "/posts",
  about: "/about",
  recipes: "/recipes",
  post: (slug: string) => `/posts/${slug}`,
  recipe: (lang: string, slug: string) => `/recipes/${lang}/${slug}`,
};

export const routes = {
  home: "/",
  posts: "/posts",
  about: "/about",
  post: (slug: string) => `/posts/${slug}`,
};

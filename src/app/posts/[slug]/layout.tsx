import { posts } from "#content";

export const generateStaticParams = async () => {
  return posts.map((post) => ({ slug: post.slug }));
};

export const generateMetadata = ({ params }: { params: { slug: string } }) => {
  const page = posts.find((page) => page.slug === params.slug);
  if (!page) {
    return {
      title: "Not Found",
    };
  }

  const title = page.title;
  const description = page.description;

  return {
    title,
    description,
    openGraph: {
      title: `Post - ${title}`,
      description,
      type: "article",
    },
  };
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

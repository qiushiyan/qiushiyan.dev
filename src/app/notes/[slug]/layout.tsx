import { SiteNav } from "@/components/nav/site-nav";
import { getNotes } from "@/lib/content/notes";

export const runtime = "edge";

export const generateStaticParams = async () => {
  return getNotes().map((note) => ({ slug: note.slug }));
};

export const generateMetadata = ({ params }: { params: { slug: string } }) => {
  const page = getNotes().find((page) => page.slug === params.slug);
  if (!page) {
    return {
      title: "Not Found",
    };
  }

  const title = page.title;

  return {
    title,
    description: "A personal note",
  };
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteNav />
      {children}
    </>
  );
}

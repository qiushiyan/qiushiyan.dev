import { SiteHeader } from "@/components/site-header";
import {
  SIDEBAR_STATE_COOKIE,
  SidebarLayout,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { host } from "@/constants";
import { getPosts } from "@/lib/content/posts";
import { posts } from "#content";

import { PostSidebar } from "./post-sidebar";

export const runtime = "edge";

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
      title,
      description,
      type: "article",
      url: `${host}${page.href}`,
      images: [
        {
          url: `/api/og?title=${title}&description=${description}`,
        },
      ],
    },
  };
};

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { cookies } = await import("next/headers");

  return (
    <>
      <SidebarLayout
        defaultOpen={cookies().get("sidebar:state")?.value === "true"}
        className="flex-col"
      >
        <SiteHeader
          renderRight={() => (
            <>
              <SidebarTrigger />
            </>
          )}
        />
        <PostSidebar />
        {children}
      </SidebarLayout>
    </>
  );
}

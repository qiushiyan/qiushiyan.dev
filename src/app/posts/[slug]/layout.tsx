import { cookies } from "next/headers";

import { SiteNav } from "@/components/nav/site-nav";
import { PostActiveHeading } from "@/components/post/post-active-heading";
import { SidebarLayout, SidebarTrigger } from "@/components/ui/sidebar";
import { host } from "@/constants";
import { findPost, getPosts } from "@/lib/content/posts";
import { PostSidebar } from "./post-sidebar";

export const runtime = "edge";

export const generateMetadata = async (props: {
  params: Promise<{ slug: string }>;
}) => {
  const params = await props.params;
  const page = getPosts().find((page) => page.slug === params.slug);
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
      url: new URL(page.href, host),
      images: [
        {
          url: `/api/og?title=${title}&description=${description}`,
        },
      ],
    },
  };
};

export default async function Layout(props: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;

  const { children } = props;
  const c = await cookies();

  return (
    <>
      <SidebarLayout
        defaultOpen={c.get("sidebar:state")?.value === "true"}
        className="flex-col"
      >
        <SiteNav
          additionalControls={<SidebarTrigger />}
          banner={
            <PostActiveHeading
              headings={findPost(params.slug)?.headings || []}
            />
          }
        />
        <PostSidebar />
        {children}
      </SidebarLayout>
    </>
  );
}

import { Suspense } from "react";

import { Container } from "@/components/container";
import { Heading } from "@/components/heading";
import { PostGrid } from "@/components/post/post-grid";
import { PostTags } from "@/components/post/post-tags";
import { FeaturedProjects } from "@/components/projects/featured-projects";
import SiteSearch from "@/components/site-search";
import { SkipLink } from "@/components/skip-link";
import { ThemeToggle } from "@/components/theme-toggle";
import { BLOGS_HEADING, MAIN_CONTENT_ID, PROJECTS_HEADING } from "@/constants";
import { getAllTags } from "@/lib/content/posts";
import { SiGithub, SiLinkedin, SiX } from "@icons-pack/react-simple-icons";
import Link from "next/link";

import { SectionIndicator } from "./section-indicator";

export const runtime = "edge";

export default function Home({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const tags = searchParams?.tags
    ? (() => {
        try {
          return JSON.parse(searchParams.tags as string) as string[];
        } catch (error) {
          return getAllTags();
        }
      })()
    : getAllTags();

  return (
    <>
      <SkipLink />
      <Container>
        <div
          className={"grid grid-cols-1 items-start gap-8 py-8 lg:grid-cols-3"}
          id={MAIN_CONTENT_ID}
        >
          <aside className="col-span-1 flex flex-col gap-8 lg:sticky lg:top-4">
            <h1 className="text-3xl font-medium underline underline-offset-8 dark:text-primary">
              Qiushi Yan
            </h1>
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <p className="text-foreground/90">Software Engineer</p>
                <ThemeToggle />
              </div>
              <p className="text-balance leading-loose text-muted-foreground">
                I create full-stack applications that are{" "}
                <span className="font-medium text-primary/80">simple</span>,{" "}
                <span className="font-medium text-primary/80">accessible</span>{" "}
                and <span className="font-medium text-primary/80">fast</span>. I
                am an open source enthusiast and here I share my technical notes
                on various programming topics.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <SiteLink
                title="Github"
                href="https://github.com/qiushiyan"
                icon={<SiGithub className="size-6" />}
              />
              <SiteLink
                title="Twitter"
                href="https://x.com/qiushizzzz"
                icon={<SiX className="size-6" />}
              />
              <SiteLink
                title="LinkedIn"
                href="https://www.linkedin.com/in/qiushiyan/"
                icon={<SiLinkedin className="size-6" />}
              />
            </div>
            <SectionIndicator />
          </aside>

          {/* <Heading className="mb-0" id="projects-heading">
            Personal Projects
          </Heading>
          <section aria-labelledby="projects-heading" className="full-width">
            <Suspense fallback={<FeaturedProjects.Skeleton />}>
              <FeaturedProjects />
            </Suspense>
          </section> */}

          <main
            id={MAIN_CONTENT_ID}
            className="col-span-1 space-y-8 md:col-span-2"
          >
            <section
              className="flex flex-col gap-2"
              aria-labelledby={BLOGS_HEADING}
            >
              <div className="flex items-center gap-1">
                <h2 className="text-xl font-medium" id={BLOGS_HEADING}>
                  Blogs
                </h2>
                <PostTags selectedTags={tags} />
              </div>

              <PostGrid selectedTags={tags} />
            </section>
            <section
              className="flex flex-col gap-2"
              aria-labelledby={PROJECTS_HEADING}
            >
              <h2 className="text-xl font-medium" id={PROJECTS_HEADING}>
                Projects
              </h2>
              <Suspense fallback={<FeaturedProjects.Skeleton />}>
                <FeaturedProjects />
              </Suspense>
            </section>
          </main>
        </div>
      </Container>
    </>
  );
}

function SiteLink({
  title,
  icon,
  href,
}: {
  title: string;
  icon: React.ReactNode;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="transition-all hover:text-primary/80"
      title={title}
      target="_blank"
    >
      {icon}
      <span className="sr-only">{title}</span>
    </Link>
  );
}

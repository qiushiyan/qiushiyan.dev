import { Heading } from "@/components/heading";
import { cn } from "@/lib/utils";

import "./home.scss";

import { Suspense } from "react";

import { PostGrid } from "@/components/post/post-grid";
import { BasicProse } from "@/components/prose-wrapper";
import { SiteHeader } from "@/components/site-header";
import { MAIN_CONTENT_ID } from "@/constants";
import { getAllTags } from "@/lib/content/posts";
import { home } from "#content";

import { FeaturedProjects } from "../components/projects/featured-projects";

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
      <SiteHeader />
      <main
        className={cn(
          "home",
          "flex h-full min-h-screen flex-col gap-6 py-4 lg:py-8"
        )}
        id={MAIN_CONTENT_ID}
      >
        <section className="space-y-4">
          <h2 className="text-4xl font-bold text-primary underline underline-offset-8">
            Hello, I&apos;m Qiushi Yan
          </h2>
          <BasicProse
            className="text-lg"
            dangerouslySetInnerHTML={{ __html: home.content }}
          ></BasicProse>
        </section>

        <Heading className="mb-0" id="projects-heading">
          Personal Projects
        </Heading>
        <section aria-labelledby="projects-heading" className="full-width">
          <Suspense fallback={<FeaturedProjects.Skeleton />}>
            <FeaturedProjects />
          </Suspense>
        </section>

        <section aria-labelledby="posts-heading">
          <Heading id="posts-heading">Posts</Heading>
          <PostGrid selectedTags={tags} />
        </section>
      </main>
    </>
  );
}

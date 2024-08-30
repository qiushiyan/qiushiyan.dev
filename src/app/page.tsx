import { Heading } from "@/components/heading";
import { getPosts } from "@/lib/content/posts";
import { cn } from "@/lib/utils";

import "./home.scss";

import { Suspense } from "react";

import { routes } from "@/lib/navigation";
import Link from "next/link";

import { PostCard } from "../components/post/post-card";
import { FeaturedProjects } from "../components/projects/featured-projects";

export default function Home() {
  return (
    <>
      <main className={cn("home", "flex h-full flex-col gap-6 p-4 lg:p-8")}>
        <section className="space-y-4">
          <h2 className="text-4xl font-bold underline underline-offset-8">
            Hello, I&apos;m Qiushi Yan
          </h2>
          <p className="text-lg">
            I am a fullstack engineer specializing in building (and occasionally
            designing) web apps. I am currently working on{" "}
            <a
              href="https://github.com/learlab/itell-strapi-demo"
              target="_blank"
            >
              iTELL
            </a>{" "}
            to build LLMs-powered textbooks. Here, I share my technical notes
            and thoughts around web development and data science.
          </p>
        </section>

        <h2 className="text-2xl font-bold">Personal Projects</h2>
        <section className="full-width overflow-x-auto">
          <Suspense fallback={<FeaturedProjects.Skeleton />}>
            <FeaturedProjects />
          </Suspense>
        </section>

        <section>
          <Heading>
            <Link href={routes.posts()}>Posts</Link>
          </Heading>

          <div className="flex flex-col gap-4">
            {getPosts()
              .slice(0, 3)
              .map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
          </div>

          <div className="flex justify-end">
            <Link href={routes.posts()}>See all</Link>
          </div>
        </section>
      </main>
    </>
  );
}

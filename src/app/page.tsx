import { Heading } from "@/components/heading";
import { getPosts } from "@/lib/content/posts";
import { cn } from "@/lib/utils";

import "./home.scss";

import { Suspense } from "react";

import { BasicProse } from "@/components/prose-wrapper";
import { home } from "#content";
import Link from "next/link";

import { PostCard } from "../components/post/post-card";
import { FeaturedProjects } from "../components/projects/featured-projects";

export default function Home() {
  return (
    <main className={cn("home", "flex h-full flex-col gap-6 py-4 lg:py-8")}>
      <section className="space-y-4">
        <h2 className="text-4xl font-bold underline underline-offset-8">
          Hello, I&apos;m Qiushi Yan
        </h2>
        <BasicProse
          className="text-lg"
          dangerouslySetInnerHTML={{ __html: home.content }}
        ></BasicProse>
      </section>

      <h2 className="text-2xl font-bold">Personal Projects</h2>
      <section className="full-width overflow-x-auto">
        <Suspense fallback={<FeaturedProjects.Skeleton />}>
          <FeaturedProjects />
        </Suspense>
      </section>

      <section>
        <Heading>
          <Link href={"/posts"}>Posts</Link>
        </Heading>

        <div className="flex flex-col gap-4">
          {getPosts().map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>
    </main>
  );
}

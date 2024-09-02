import { Heading } from "@/components/heading";

import "./page.scss";

import { PostCard } from "@/components/post/post-card";

import "@/lib/content/posts";

import { SiteHeader } from "@/components/site-header";
import { getPosts } from "@/lib/content/posts";

export default function Page() {
  return (
    <>
      <SiteHeader />
      <div className="posts">
        <Heading className="text-foreground">Posts</Heading>
        <ol className="space-y-4">
          {getPosts().map((post) => (
            <li key={post.slug}>
              <PostCard post={post} />
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}

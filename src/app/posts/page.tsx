import { Heading } from "@/components/heading";

import "./page.scss";

import { PostCard } from "@/components/post/post-card";

import "@/lib/content/posts";

import { Container } from "@/components/container";
import { StaggerList } from "@/components/motion";
import { SiteNav } from "@/components/nav/site-nav";
import { getPosts } from "@/lib/content/posts";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <>
      <SiteNav />
      <Container className="posts">
        <Heading className="text-foreground">Posts</Heading>
        <StaggerList as="ol" className="space-y-4">
          {getPosts().map((post) => (
            <li key={post.slug}>
              <PostCard post={post} />
            </li>
          ))}
        </StaggerList>
      </Container>
    </>
  );
}

import { Suspense } from "react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { cn, postViewTransitionName } from "@/lib/utils";
import { Post } from "#content";
import { CalendarIcon, EyeIcon, TagIcon } from "lucide-react";
import { Link } from "next-view-transitions";
import Image from "next/image";

import { Badge } from "../../ui/badge";
import { PostDescription } from "../post-description";
import { PostViews } from "../post-views";

export const PostCard = ({
  post,
  featured,
}: {
  post: Post;
  featured: boolean;
}) => {
  if (featured) {
    return <FeaturedPostCard post={post} />;
  }

  return (
    <Link
      href={post.href}
      className={cn("col-span-1", featured && "lg:col-span-2 lg:row-span-2")}
    >
      <Card
        className={cn(
          "group flex h-full flex-col gap-2 overflow-hidden rounded-md bg-white shadow-sm transition-all hover:scale-105 dark:bg-background"
        )}
      >
        <CardHeader className="pb-2">
          <PostCardHeader post={post} />
        </CardHeader>

        <CardContent>
          <PostCardBody post={post} />
        </CardContent>

        <CardFooter className="items-center justify-between gap-2">
          <PostCardFooter post={post} />
        </CardFooter>
      </Card>
    </Link>
  );
};

function FeaturedPostCard({ post }: { post: Post }) {
  return (
    <Link
      href={post.href}
      className={
        "col-span-1 grid grid-cols-subgrid rounded border py-4 lg:col-span-2 lg:h-[360px]"
      }
    >
      <Card
        className={cn(
          "group flex flex-col gap-2 overflow-hidden rounded-md border-none bg-white px-0 shadow-sm dark:bg-background"
        )}
      >
        <CardHeader className="py-2">
          <PostCardHeader post={post} />
        </CardHeader>

        <CardContent className="space-y-4">
          <PostCardBody post={post} />
          <div className="hidden lg:block">
            <Badge variant={"secondary"}>Latest</Badge>
          </div>
        </CardContent>

        <CardFooter className="mt-auto items-center justify-between gap-2">
          <PostCardFooter post={post} />
        </CardFooter>
      </Card>
      <div className="relative">
        <Image
          src={"/featured.avif"}
          alt={"a nature scene"}
          layout="fill"
          objectFit="cover"
          className="rounded-md px-2"
        />
      </div>
    </Link>
  );
}

function PostCardHeader({ post }: { post: Post }) {
  return (
    <div className="flex flex-row items-start justify-between transition-all group-hover:text-primary/80">
      <h3
        className="text-pretty text-xl font-bold"
        style={{
          viewTransitionName: postViewTransitionName(post.slug),
        }}
      >
        {post.title}
      </h3>
      {post.draft && <Badge>Draft</Badge>}
    </div>
  );
}

function PostCardBody({ post }: { post: Post }) {
  return (
    <PostDescription
      className="line-clamp-3 text-pretty text-sm text-muted-foreground"
      description={post.descriptionHtml}
    />
  );
}

function PostCardFooter({ post }: { post: Post }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-1">
        <CalendarIcon className="size-4" />
        <time dateTime={post.date} className="text-xs text-muted-foreground">
          {new Date(post.date).toLocaleDateString()}
        </time>
      </div>

      <div className="ml-auto flex items-center gap-3">
        <div className="flex items-center gap-1">
          <EyeIcon className="size-4" />
          <Suspense fallback={<PostViews.Skeleton />}>
            <PostViews slug={post.slug} className="text-xs" numberOnly />
          </Suspense>
        </div>
        <div className="flex items-center gap-1">
          <TagIcon className="size-4" />
          <span className="py-1 text-xs">{post.tags.join(", ")}</span>
        </div>
      </div>
    </div>
  );
}

import { Suspense } from "react";
import Image from "next/image";
import { Post } from "#content";
import { CalendarIcon, EyeIcon, TagIcon } from "lucide-react";
import { Link } from "next-view-transitions";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { cn, postViewTransitionName } from "@/lib/utils";
import { Badge } from "../../ui/badge";
import { PostDescription } from "../post-description";
import { PostViews } from "../post-views";

export const PostCard = ({
  post,
  featured = false,
}: {
  post: Post;
  featured?: boolean;
}) => {
  if (featured) {
    return <FeaturedPostCard post={post} />;
  }

  return (
    <Link
      href={post.href}
      className={"col-span-full border-b-2 last-of-type:border-none"}
    >
      <Card
        className={cn(
          "group flex h-full flex-col gap-2 overflow-hidden rounded-md border-none shadow-none transition-all last-of-type:border-b-0 hover:bg-muted hover:text-muted-foreground hover:shadow-md"
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
        "col-span-full grid rounded border lg:min-h-[360px] lg:grid-cols-subgrid"
      }
    >
      <Card
        className={cn(
          "group order-1 flex flex-col gap-2 overflow-hidden rounded-md border-none px-0 py-4 shadow-none"
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
      <div className="relative order-2">
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
        className="text-pretty text-lg font-medium"
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

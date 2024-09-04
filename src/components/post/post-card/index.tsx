import { Suspense } from "react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { postViewTransitionName } from "@/lib/utils";
import { Post } from "#content";
import { CalendarIcon, TagIcon } from "lucide-react";
import { Link } from "next-view-transitions";

import { Badge } from "../../ui/badge";
import { PostDescription } from "../post-description";
import { PostViews } from "../post-views";

export const PostCard = ({ post }: { post: Post }) => {
  return (
    <Link href={post.href}>
      <Card className="group flex h-fit flex-col gap-2 overflow-hidden rounded-md bg-white shadow-sm transition-all hover:scale-105 dark:bg-background">
        <CardHeader className="flex items-center justify-between pb-2 transition-all group-hover:text-primary/80">
          <h3
            className="text-pretty text-xl font-bold"
            style={{
              viewTransitionName: postViewTransitionName(post.slug),
            }}
          >
            {post.title}
          </h3>
          {post.draft && <Badge>Draft</Badge>}
        </CardHeader>

        <CardContent>
          <PostDescription
            className="line-clamp-3 text-pretty text-sm text-muted-foreground"
            description={post.descriptionHtml}
          />
        </CardContent>

        <CardFooter className="items-center justify-between gap-2">
          <Suspense fallback={<PostViews.Skeleton />}>
            <PostViews slug={post.slug} className="text-xs lg:text-sm" />
          </Suspense>
          <div className="flex items-center gap-2">
            <CalendarIcon className="size-4" />
            <time
              dateTime={post.date}
              className="text-xs text-muted-foreground"
            >
              {new Date(post.date).toLocaleDateString()}
            </time>
          </div>
          <div className="flex items-center gap-0.5">
            <TagIcon className="size-4" />
            <span className="px-1.5 py-1 text-xs font-medium">
              {post.tags.join(", ")}
            </span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

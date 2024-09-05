import { Suspense } from "react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { postViewTransitionName } from "@/lib/utils";
import { Post } from "#content";
import { CalendarIcon, EyeIcon, TagIcon } from "lucide-react";
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
          <div className="flex items-center gap-1">
            <CalendarIcon className="size-4" />
            <time
              dateTime={post.date}
              className="text-xs text-muted-foreground"
            >
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
        </CardFooter>
      </Card>
    </Link>
  );
};

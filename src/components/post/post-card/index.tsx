import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { postViewTransitionName } from "@/lib/utils";
import { Post } from "#content";
import { CalendarIcon } from "lucide-react";
import { Link } from "next-view-transitions";

import { Badge } from "../../ui/badge";
import { PostDescription } from "../post-description";

export const PostCard = ({ post }: { post: Post }) => {
  return (
    <Link href={`/posts/${post.slug}`} className="hover:!no-underline">
      <Card className="flex h-fit flex-col gap-2 overflow-hidden rounded-md shadow-sm transition-all hover:bg-accent hover:text-accent-foreground">
        <CardHeader className="flex items-center justify-between">
          <h2
            className="text-pretty text-xl font-bold"
            style={{
              viewTransitionName: postViewTransitionName(post.slug),
            }}
          >
            {post.title}
          </h2>
          {post.draft && <Badge>Draft</Badge>}
        </CardHeader>

        <CardContent>
          <PostDescription
            className="line-clamp-3 text-pretty text-sm text-muted-foreground"
            description={post.description}
          />
        </CardContent>

        <CardFooter className="items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            <time
              dateTime={post.date}
              className="text-sm text-muted-foreground"
            >
              {new Date(post.date).toLocaleDateString()}
            </time>
          </div>
          <div className="flex items-center gap-1">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded bg-muted px-2 py-1 text-xs font-medium text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

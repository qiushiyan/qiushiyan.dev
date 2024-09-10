import { cn, postViewTransitionName } from "@/lib/utils";
import { Post } from "#content";
import { CalendarIcon, ClockIcon, EyeIcon } from "lucide-react";

import { Badge } from "../ui/badge";
import { PostDescription } from "./post-description";
import { PostViews } from "./post-views";

export const PostBanner = ({ post }: { post: Post }) => {
  return (
    <header className="grid gap-2 py-6">
      <div className="flex flex-row items-center gap-2">
        <h1
          className={cn(
            "mb-4 text-balance text-4xl font-extrabold tracking-wide"
          )}
          style={{
            viewTransitionName: postViewTransitionName(post.slug),
          }}
          id="post-banner"
        >
          {post.title}
        </h1>
        {post.draft && <Badge>Draft</Badge>}
      </div>
      <PostDescription
        className="flex-grow text-sm lg:text-base"
        description={post.descriptionHtml}
      />
      <div className="flex flex-wrap items-center space-x-6 text-sm text-muted-foreground">
        <div className="flex items-center">
          <CalendarIcon className="mr-2 h-4 w-4" />
          <time dateTime={post.date}>
            {new Date(post.date).toLocaleDateString()}
          </time>
        </div>
        <div className="flex items-center">
          <ClockIcon className="mr-2 h-4 w-4" />
          <span>{post.metadata.readingTime} min read</span>
        </div>
        <div className="flex items-center">
          <EyeIcon className="mr-2 h-4 w-4" />
          <PostViews slug={post.slug} />
        </div>
      </div>
      {post.lastModified && (
        <div className="flex items-center gap-2">
          <ClockIcon className="size-4" />
          <span className="text-sm text-muted-foreground">
            Last modified: {new Date(post.lastModified).toLocaleDateString()}
          </span>
        </div>
      )}
    </header>
  );
};

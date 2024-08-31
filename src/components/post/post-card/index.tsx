import { Post } from "#content";
import { ArrowRightIcon } from "lucide-react";
import { Link } from "next-view-transitions";

import { Badge } from "../../ui/badge";
import { PostDescription } from "../post-description";
import { PostLink } from "./post-link";

export const PostCard = ({ post }: { post: Post }) => {
  return (
    <div className="flex flex-col gap-2 py-4 has-[[data-pending]]:animate-pulse">
      <header className="flex items-center justify-between">
        <PostLink title={post.title} slug={post.slug} />
        {post.draft && <Badge>Draft</Badge>}
      </header>

      <PostDescription
        className="line-clamp-3 text-pretty text-foreground"
        description={post.description}
      />
      <footer className="flex items-center justify-between">
        <Link
          href={`/posts/${post.slug}`}
          className="group flex items-center gap-2"
        >
          Read more
          <ArrowRightIcon className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-2" />
        </Link>
        <time dateTime={post.date} className="text-sm text-muted-foreground">
          {new Date(post.date).toLocaleDateString()}
        </time>
      </footer>
    </div>
  );
};

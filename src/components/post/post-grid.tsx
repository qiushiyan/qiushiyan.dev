import { getPostsByTags } from "@/lib/content/posts";
import { PostCard } from "./post-card";

export const PostGrid = ({ selectedTags }: { selectedTags: string[] }) => {
  return <PostCards selectedTags={selectedTags} />;
};

const PostCards = ({ selectedTags }: { selectedTags: string[] }) => {
  const posts = getPostsByTags(selectedTags);

  return (
    <div className="grid grid-cols-1 gap-4 lg:auto-rows-min lg:grid-cols-2">
      {posts.length > 0 ? (
        posts.map((post, index) => (
          <PostCard key={post.slug} post={post} featured={index === 0} />
        ))
      ) : (
        <div className="col-span-2 text-muted-foreground">No posts found</div>
      )}
    </div>
  );
};

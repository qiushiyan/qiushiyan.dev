import { getAllTags } from "@/lib/content/posts";
import { TagsIcon } from "lucide-react";

import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { PostTagsClient } from "./post-tags.client";

export function PostTags({ selectedTags }: { selectedTags: string[] }) {
  const allTags = getAllTags();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={"ghost"} className="flex items-center gap-2">
          <TagsIcon className="size-6" />
          <span className="sr-only">Filter posts by tags</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" side="top" align="center">
        <PostTagsClient allTags={allTags} selectedTags={selectedTags} />
      </PopoverContent>
    </Popover>
  );
}

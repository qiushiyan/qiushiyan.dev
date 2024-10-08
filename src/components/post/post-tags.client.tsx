"use client";

import { startTransition, useOptimistic } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

export const PostTagsClient = ({
  selectedTags,
  allTags,
}: {
  selectedTags: string[];
  allTags: string[];
}) => {
  const router = useRouter();
  const [optimisticTags, setOptimisticTags] = useOptimistic(selectedTags);

  const toggleTag = (tag: string) => {
    const newTags = optimisticTags.includes(tag)
      ? optimisticTags.filter((t) => t !== tag)
      : [...optimisticTags, tag];

    setOptimisticTags(newTags);

    startTransition(() => {
      router.push(`/?tags=${JSON.stringify(newTags)}`);
    });
  };

  return (
    <form className="mb-8 flex flex-wrap gap-2">
      <fieldset>
        <legend className="sr-only">Filter by Tags</legend>
        <div className="mb-4 flex flex-wrap gap-2">
          {Array.from(allTags).map((tag) => (
            <div key={tag} className="flex items-center">
              <Checkbox
                id={`tag-${tag}`}
                checked={optimisticTags.includes(tag)}
                onCheckedChange={() => toggleTag(tag)}
                className="sr-only"
              />
              <Label
                htmlFor={`tag-${tag}`}
                className={`cursor-pointer rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-200 ease-in-out hover:ring-2 hover:ring-ring ${
                  optimisticTags.includes(tag)
                    ? "text-foreground ring-2 ring-ring"
                    : ""
                }`}
              >
                {tag}
              </Label>
            </div>
          ))}
        </div>
      </fieldset>
    </form>
  );
};

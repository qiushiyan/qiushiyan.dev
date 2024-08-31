"use client";

import { useTransition } from "react";

import { postViewTransitionName } from "@/lib/utils";
import { useTransitionRouter } from "next-view-transitions";

export const PostLink = ({ title, slug }: { title: string; slug: string }) => {
  const router = useTransitionRouter();
  const [pending, startTransition] = useTransition();

  return (
    <button
      role="link"
      onClick={() => startTransition(() => router.push(`/posts/${slug}`))}
      disabled={pending}
      data-pending={pending ? "" : undefined}
    >
      <h2
        className="link text-pretty text-2xl font-bold !text-foreground"
        style={{
          viewTransitionName: postViewTransitionName(slug),
        }}
      >
        {title}
      </h2>
    </button>
  );
};

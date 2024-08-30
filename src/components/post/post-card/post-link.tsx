"use client";

import { useTransition } from "react";

import { routes } from "@/lib/navigation";
import { postViewTransitionName } from "@/lib/utils";
import { useTransitionRouter } from "next-view-transitions";

export const PostLink = ({ title, slug }: { title: string; slug: string }) => {
  const router = useTransitionRouter();
  const [pending, startTransition] = useTransition();

  return (
    <button
      role="link"
      className={"hover:underline"}
      onClick={() => startTransition(() => router.push(routes.post({ slug })))}
      disabled={pending}
      data-pending={pending ? "" : undefined}
    >
      <h2
        className="text-pretty text-2xl font-bold text-foreground transition-colors duration-150 hover:text-primary/80"
        style={{
          viewTransitionName: postViewTransitionName(slug),
        }}
      >
        {title}
      </h2>
    </button>
  );
};

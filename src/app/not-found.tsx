import Link from "next/link";

import { PageHeader } from "@/components/page-layout";
import { PageShell } from "@/components/page-shell";
import { routes } from "@/lib/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <PageShell className="sm:py-24">
      <PageHeader
        title="Page not found"
        description="This page doesn’t exist or has moved."
      />
      <p className="mt-6 flex gap-6 text-sm font-medium">
        <Link
          href={routes.home}
          className="underline underline-offset-4 transition-colors hover:text-primary"
        >
          Home
        </Link>
        <Link
          href={routes.posts}
          className="underline underline-offset-4 transition-colors hover:text-primary"
        >
          All posts
        </Link>
      </p>
    </PageShell>
  );
}

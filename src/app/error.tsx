"use client";

import { useEffect } from "react";
import Link from "next/link";

import { SiteNavBar } from "@/components/nav/site-nav-bar";
import { PageHeader, PageMain } from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/navigation";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <>
      {/* Search needs the server-built index, which an error boundary can't load. */}
      <SiteNavBar />
      <PageMain className="sm:py-24">
        <PageHeader
          title="Something went wrong"
          description="This page couldn’t be loaded."
        />
        <div className="mt-6 flex items-center gap-6">
          <Button variant="outline" onClick={reset}>
            Try again
          </Button>
          <Link
            href={routes.home}
            className="text-sm font-medium underline underline-offset-4 transition-colors hover:text-primary"
          >
            Home
          </Link>
        </div>
      </PageMain>
    </>
  );
}

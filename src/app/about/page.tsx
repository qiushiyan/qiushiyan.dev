import { about } from "#content";

import { HtmlRenderer } from "@/components/html-renderer";
import { PageHeader } from "@/components/page-layout";
import { PageShell } from "@/components/page-shell";
import { ArticleProse } from "@/components/prose-wrapper";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  openGraph: { type: "website", title: "About" },
};

export default function AboutPage() {
  return (
    <PageShell>
      <PageHeader title="About" />
      {/* Section headings stay below the 24px page title. */}
      <ArticleProse className="mt-8 prose-h2:text-xl/8 prose-h2:font-semibold prose-h2:tracking-tight">
        <HtmlRenderer content={about.content} />
      </ArticleProse>
    </PageShell>
  );
}

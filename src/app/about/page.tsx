import { ArticleProse } from "@/components/prose-wrapper";
import { about } from "#content";
import htmr from "htmr";

export default function AboutPage() {
  return (
    <ArticleProse className="mx-auto min-h-screen max-w-3xl prose-headings:underline prose-headings:underline-offset-4">
      <article>{htmr(about.content)}</article>
    </ArticleProse>
  );
}

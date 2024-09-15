import { HtmlRenderer } from "@/components/html-renderer";
import { ArticleProse } from "@/components/prose-wrapper";
import { about } from "#content";

export default function AboutPage() {
  return (
    <ArticleProse className="mx-auto min-h-screen max-w-3xl prose-headings:underline prose-headings:underline-offset-4">
      <article>
        <HtmlRenderer content={about.content} />
      </article>
    </ArticleProse>
  );
}

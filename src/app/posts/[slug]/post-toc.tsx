import { cn } from "@/lib/utils";
import { Post } from "#content";
import { Link } from "next-view-transitions";

interface Props {
  headings: Post["headings"];
}

export const PostToc = ({ headings }: Props) => {
  return (
    <nav className="toc px-2 text-sm tracking-tight lg:text-base">
      <h3 className="font-heading text-base lg:text-lg">
        <Link href="#post-banner" className="!text-foreground">
          Table of contents
        </Link>
      </h3>
      <ol className="flex list-none flex-col gap-1 px-0">
        {headings.map((item) => (
          <li
            key={item.slug}
            className={cn(item.depth === 3 ? "ml-4" : "px-0")}
          >
            <Link
              href={`#${item.slug}`}
              className={cn(
                "text-pretty !text-secondary-foreground !no-underline transition-colors duration-150 hover:!text-primary/80 hover:!underline hover:!underline-offset-4"
              )}
              data-depth={item.depth}
              data-heading-slug={item.slug}
              dangerouslySetInnerHTML={{ __html: item.html }}
            ></Link>
          </li>
        ))}
      </ol>
    </nav>
  );
};

import { Steps } from "@/components/ui/steps";
import { Callout } from "./callout";
import { CodeBlock } from "./codehike/code-block";
import { Image } from "./codehike/image";
import { InlineCode } from "./codehike/inline-code";
import type { ComponentProps, ComponentType } from "react";

/**
 * Tag name → component, for HtmlRenderer. Content props arrive as HTML
 * attribute strings, so each component declares its own props.
 */
export type ContentComponents = Record<string, ComponentType<never>>;

/** Components every rendered Markdown page can use. */
export const sharedComponents: ContentComponents = {
  img: Image,
  "my-callout": Callout,
  "my-steps": Steps,
  "code-block": CodeBlock,
  "code-inline": InlineCode,
};

/** A section heading that links to itself, so readers can copy a link to it. */
const sectionHeading = (Tag: "h2" | "h3") =>
  function SectionHeading({ id, children, ...props }: ComponentProps<"h2">) {
    return (
      <Tag id={id} {...props}>
        {id ? (
          <a href={`#${id}`} className="heading-anchor">
            {children}
          </a>
        ) : (
          children
        )}
      </Tag>
    );
  };

const articleComponents: ContentComponents = {
  ...sharedComponents,
  h2: sectionHeading("h2"),
  h3: sectionHeading("h3"),
};

/*
  Components only some posts use, named in their frontmatter `components`
  list. Loading them on demand keeps their client code (tabs, the counter
  demo) off pages that don't render them.
*/
const lazyComponents: Record<string, () => Promise<ComponentType<never>>> = {
  "code-switcher": () =>
    import("./codehike/code-switcher").then((mod) => mod.CodeSwitcher),
  iframe: () => import("./iframe").then((mod) => mod.Iframe),
  "do-counter-example": () =>
    import("./post-example/do-counter").then((mod) => mod.DoCounterExample),
  "quiz-table-example": () =>
    import("./post-example/postgres-distinct-on/quiz-table").then(
      (mod) => mod.QuizTable
    ),
};

/** The components for a post or note body: the shared set, heading links, and its lazy extras. */
export const getComponents = async (
  names: string[] = []
): Promise<ContentComponents> => {
  const extras = await Promise.all(
    names
      .filter((name) => name in lazyComponents)
      .map(async (name) => [name, await lazyComponents[name]()] as const)
  );
  return { ...articleComponents, ...Object.fromEntries(extras) };
};

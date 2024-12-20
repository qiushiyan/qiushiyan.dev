import { ComponentType, Suspense } from "react";

import { Steps } from "@/components/ui/steps";
import { Callout } from "./callout";
import { CodeBlock } from "./codehike/code-block";
import { Image } from "./codehike/image";
import { InlineCode } from "./codehike/inline-code";
import { BlogLink } from "./codehike/link";
import {
  WiderContent,
  WiderContentAside,
  WiderContentMain,
} from "./wider-content";

export const sharedComponents = {
  "my-callout": Callout,

  img: (props: ImageProps) => {
    return (
      <Image
        src={props.src}
        alt={props.alt}
        className={props.className}
        width={props.width}
        height={props.height}
      />
    );
  },
  a: BlogLink,
  "code-block": ({ value, lang, filename, caption }: CodeBlockProps) => {
    return (
      <CodeBlock value={value} lang={lang} customMeta={{ filename, caption }} />
    );
  },
  "code-inline": ({ value, lang }: CodeInlineProps) => {
    return <InlineCode value={value} lang={lang} />;
  },
  "my-steps": Steps,
  "wider-content": WiderContent,
  "wider-content-main": WiderContentMain,
  "wider-content-aside": WiderContentAside,
};

const registry: Record<string, any> = {
  "code-switcher": () =>
    import("./codehike/code-switcher").then((mod) => mod.CodeSwitcher),
  iframe: () => import("./iframe").then((mod) => mod.MyIframe),
  "do-counter-example": () =>
    import("./post-example/do-counter").then((mod) => mod.DoCounterExample),
  "quiz-table-example": () =>
    import("./post-example/postgres-distinct-on/quiz-table").then(
      (mod) => mod.QuizTable
    ),
};

export const getComponents = async (components?: string[]) => {
  if (!components) {
    return sharedComponents;
  }

  const otherComponents: Record<string, ComponentType<any>> = {};
  for (const name of components) {
    if (registry[name]) {
      const Component = await registry[name]();
      otherComponents[name] = (props: any) => (
        <Suspense>
          <Component {...props} />
        </Suspense>
      );
    }
  }

  return {
    ...sharedComponents,
    ...otherComponents,
  };
};

type ImageProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  className: string;
};

type CodeBlockProps = {
  value: string;
  lang: string;
  filename?: string;
  caption?: string;
};

type CodeInlineProps = {
  value: string;
  lang: string;
};

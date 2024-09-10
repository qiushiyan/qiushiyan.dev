import { Callout } from "./callout";
import { CodeBlock } from "./codehike/code-block";
import { CodeSwitcher } from "./codehike/code-switcher";
import { Image } from "./codehike/image";
import { InlineCode } from "./codehike/inline-code";
import { BlogLink } from "./codehike/link";
import { MyIframe } from "./iframe";

export const MarkdownSharedComponents = {
  "my-callout": Callout,
  iframe: MyIframe,
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
  "code-switcher": CodeSwitcher,
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

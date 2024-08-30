import { Callout } from "./callout";
import { CodeBlock } from "./codehike/code-block";
import { Image } from "./codehike/image";
import { InlineCode } from "./codehike/inline-code";
import { LanguageSwitcher } from "./codehike/language-switcher";
import { BlogLink } from "./codehike/link";

export const MarkdownSharedComponents = {
  "my-callout": Callout,
  img: Image,
  "i-code": ({
    value,
    lang,
    filename,
    caption,
  }: {
    value: string;
    lang: string;
    filename?: string;
    caption?: string;
  }) => {
    return <CodeBlock value={value} lang={lang} meta={{ filename, caption }} />;
  },
  a: BlogLink,
  "i-inline-code": ({ value, lang }: { value: string; lang: string }) => (
    <InlineCode codeblock={{ value, lang, meta: "" }} />
  ),
  "language-switcher": LanguageSwitcher,
};

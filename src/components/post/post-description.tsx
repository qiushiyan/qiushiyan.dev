import htmr from "htmr";

import { InlineCode } from "../codehike/inline-code";
import { HtmlRenderer } from "../html-renderer";
import { BasicProse } from "../prose-wrapper";

export const PostDescription = ({
  description,
  className,
}: {
  description: string;
  className?: string;
}) => {
  return (
    <BasicProse className={className}>
      <HtmlRenderer
        content={description}
        components={{
          "code-inline": ({ value, lang }: { value: string; lang: string }) => (
            <InlineCode value={value} lang={lang} />
          ),
        }}
      />
    </BasicProse>
  );
};

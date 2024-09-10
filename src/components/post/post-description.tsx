import htmr from "htmr";

import { InlineCode } from "../codehike/inline-code";
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
      {htmr(description, {
        transform: {
          // @ts-ignore
          "code-inline": ({ value, lang }: { value: string; lang: string }) => (
            <InlineCode value={value} lang={lang} />
          ),
        },
      })}
    </BasicProse>
  );
};

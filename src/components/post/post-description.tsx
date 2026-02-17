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
          "code-inline": ({
            value,
            lang,
            highlighted,
          }: {
            value: string;
            lang: string;
            highlighted?: string;
          }) => (
            <InlineCode
              value={value}
              lang={lang}
              highlighted={highlighted}
            />
          ),
        }}
      />
    </BasicProse>
  );
};

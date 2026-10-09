import { InlineCode, PlainInlineCode } from "../codehike/inline-code";
import { HtmlRenderer } from "../html-renderer";

/** A post's Markdown description (build-time HTML), with code on the inline-code chip. */
export const PostDescription = ({
  description,
  className,
}: {
  description: string;
  className?: string;
}) => {
  return (
    <div className={className}>
      <HtmlRenderer
        content={description}
        components={{ "code-inline": InlineCode, code: PlainInlineCode }}
      />
    </div>
  );
};

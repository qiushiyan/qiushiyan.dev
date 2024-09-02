import { highlight, Inline, RawCode } from "codehike/code";

export async function InlineCode({ codeblock }: { codeblock: RawCode }) {
  const highlighted = await highlight(codeblock, "github-from-css");

  return (
    <Inline style={highlighted.style} code={highlighted} data-inline-code />
  );
}

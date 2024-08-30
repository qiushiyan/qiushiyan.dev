import { highlight, Inline, RawCode } from "codehike/code";

export async function InlineCode({ codeblock }: { codeblock: RawCode }) {
  const highlighted = await highlight(codeblock, "one-dark-pro");

  return <Inline code={highlighted} data-inline-code />;
}

import { highlight, Inline, RawCode } from "codehike/code";

export async function InlineCode({
  value,
  lang,
}: {
  value: string;
  lang: string;
}) {
  const highlighted = await highlight(
    { value, lang, meta: "" },
    "github-from-css"
  );

  return (
    <Inline style={highlighted.style} code={highlighted} data-inline-code />
  );
}

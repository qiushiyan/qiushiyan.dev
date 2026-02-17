import { HighlightedCode, Inline } from "codehike/code";

export function InlineCode({
  value,
  lang,
  highlighted: highlightedJson,
}: {
  value: string;
  lang: string;
  highlighted?: string;
}) {
  if (!highlightedJson) {
    // Fallback: render code without syntax highlighting
    return <code data-inline-code>{value}</code>;
  }

  const highlighted = JSON.parse(highlightedJson) as HighlightedCode;

  return (
    <Inline style={highlighted.style} code={highlighted} data-inline-code />
  );
}

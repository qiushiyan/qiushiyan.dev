import type { HighlightedCode } from "codehike/code";

/**
 * The part of a CodeHike highlight result that `Pre` and `Inline` read.
 * The content build stores only these fields: the raw `value` and `code`
 * would duplicate each block's source in the page payload.
 */
export type HighlightedTokens = Pick<
  HighlightedCode,
  "tokens" | "annotations" | "lang" | "themeName" | "style"
>;

/** Parses a build-time `highlighted` attribute back into what `Pre` expects. */
export const parseHighlighted = (
  json: string | HighlightedTokens
): HighlightedCode => ({
  value: "",
  code: "",
  meta: "",
  ...(typeof json === "string"
    ? (JSON.parse(json) as HighlightedTokens)
    : json),
});

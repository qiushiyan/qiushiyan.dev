// `code` or _lang`code`_, the site's syntax for highlighted inline code.
// The capture group makes `split` keep the code spans at odd indices.
const CODE_SPAN = /(_[\w+-]+`[^`]+`_|`[^`]+`)/;

const stripInlineMarkup = (text: string) =>
  text
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/(\*\*|\*|(?<!\w)__|(?<!\w)_)(?=\S)(.+?)(?<=\S)\1(?!\w)/g, "$2");

/**
 * Plain text from a one-line Markdown description, for places that can't
 * render HTML: feed items, Open Graph images and search results.
 */
export const markdownToPlainText = (markdown: string) =>
  markdown
    .split(CODE_SPAN)
    .map((part, index) =>
      index % 2 === 1
        ? part.slice(part.indexOf("`") + 1, part.lastIndexOf("`"))
        : stripInlineMarkup(part)
    )
    .join("")
    .replace(/\s+/g, " ")
    .trim();

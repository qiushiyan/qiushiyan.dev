/** An embedded page (`<iframe>` in Markdown), with a plain link out beneath it. */
export const Iframe = ({
  src,
  title,
  caption,
  height,
}: {
  src?: string;
  title?: string;
  caption?: string;
  height?: string;
}) => {
  return (
    <figure className="not-prose my-8">
      <iframe
        src={src}
        title={title ?? caption ?? "Embedded page"}
        loading="lazy"
        className="block w-full rounded-lg border bg-background"
        style={{ height: height ?? "min(80dvh, 48rem)" }}
      />
      <figcaption className="mt-2 flex justify-between gap-4 text-sm text-muted-foreground">
        <span className="text-pretty">{caption}</span>
        {src && (
          <a
            href={src}
            target="_blank"
            rel="noreferrer"
            className="shrink-0 underline decoration-current/40 underline-offset-[3px] transition-[text-decoration-color] duration-150 hover:decoration-current"
          >
            Open in new tab
          </a>
        )}
      </figcaption>
    </figure>
  );
};

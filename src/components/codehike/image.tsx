import NextImage from "next/image";

import { cn } from "@/lib/utils";

type Props = {
  src: string;
  alt?: string;
  className?: string;
  width?: number | string;
  height?: number | string;
};

const imageClasses =
  "h-auto max-w-full rounded-md outline-1 -outline-offset-1 outline-black/10 dark:outline-white/10";

/**
 * A Markdown image. Local images carry their size from the build (see
 * rehypeImageSize) and go through next/image; remote ones have no known size
 * and render as a plain lazy <img>.
 */
export const Image = ({ src, alt = "", className, width, height }: Props) => {
  const w = Number(width);
  const h = Number(height);
  const sized = w > 0 && h > 0;
  const wide = className?.split(" ").includes("wider");

  return (
    <figure
      className={cn(
        "not-prose my-8 flex flex-col items-center gap-3",
        className
      )}
    >
      {sized ? (
        <NextImage
          src={src}
          alt={alt}
          width={w}
          height={h}
          sizes={
            wide
              ? "(min-width: 80rem) 72rem, (min-width: 48rem) 46rem, 100vw"
              : "(min-width: 48rem) 46rem, 100vw"
          }
          className={imageClasses}
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element -- no intrinsic size for remote images
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          className={imageClasses}
        />
      )}
      {alt && (
        <figcaption className="text-center text-sm text-pretty text-muted-foreground">
          {alt}
        </figcaption>
      )}
    </figure>
  );
};

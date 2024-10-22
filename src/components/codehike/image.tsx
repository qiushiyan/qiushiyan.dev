import NextImage from "next/image";

import { cn } from "@/lib/utils";

type Props = {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
};

export const Image = ({
  src,
  alt,
  width = 700,
  height = 500,
  className,
}: Props) => {
  return (
    <figure
      className={cn(
        "flex flex-col items-center justify-center gap-4",
        className
      )}
    >
      <NextImage
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="object-cover"
      />
      <figcaption className="text-sm text-foreground/80 lg:text-base">
        {alt}
      </figcaption>
    </figure>
  );
};

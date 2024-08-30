import NextImage from "next/image";

type Props = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
};

export const Image = ({
  src,
  alt,
  width = 600,
  height = 400,
  ...rest
}: Props) => {
  return (
    <div className="flex items-center justify-center">
      <figure
        className="relative"
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        <NextImage src={src} alt={alt} fill className="object-cover" />
        <figcaption className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-slate-300">
          {alt}
        </figcaption>
      </figure>
    </div>
  );
};

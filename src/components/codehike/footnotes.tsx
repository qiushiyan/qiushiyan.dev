import { AnnotationHandler, InnerLine } from "codehike/code";

export const footnotes: AnnotationHandler = {
  name: "ref",
  AnnotatedLine: ({ annotation, ...props }) => {
    return (
      <div className="flex gap-2">
        <InnerLine merge={props} />
        <FootnoteNumber n={annotation.data.n} />
      </div>
    );
  },
};

export const FootnoteNumber = ({ n }: { n: number }) => {
  return (
    <span
      data-value={n}
      className="inline-block h-4 w-4 self-center rounded-full border border-slate-400 text-center font-mono text-sm leading-4 after:content-[attr(data-value)]"
    />
  );
};

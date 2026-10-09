import { InnerLine } from "codehike/code";
import { ChevronDownIcon } from "lucide-react";

import type { AnnotationHandler, BlockAnnotation } from "codehike/code";

/*
  `!collapse(1:10)` turns lines 1–10 into a disclosure: line 1 is the
  toggle, lines 2–10 the content. `!collapse(1:10) collapsed` starts closed.

  It is a native <details>/<summary>: keyboard operable and announced as
  expanded/collapsed without client JavaScript, and a closed region's lines
  stay in the HTML, so find-in-page reaches them. (A client component per
  region also made React's dev-mode payload grow until R-heavy posts
  crashed the tab.)
*/
export const collapse: AnnotationHandler = {
  name: "collapse",
  transform: (annotation: BlockAnnotation) => {
    const { fromLineNumber, toLineNumber } = annotation;
    return [
      annotation,
      {
        ...annotation,
        fromLineNumber,
        toLineNumber: fromLineNumber,
        name: "CollapseTrigger",
        data: { hidden: toLineNumber - fromLineNumber },
      },
      {
        ...annotation,
        fromLineNumber: fromLineNumber + 1,
        name: "CollapseContent",
      },
    ];
  },
  Block: ({ annotation, children }) => (
    <details open={annotation.query !== "collapsed"} className="group/collapse">
      {children}
    </details>
  ),
};

const chevron = (
  <ChevronDownIcon
    aria-hidden
    className="inline size-3.5 -rotate-90 text-muted-foreground transition-[color,rotate] duration-150 group-open/collapse:rotate-0 group-hover:text-foreground motion-reduce:transition-none"
  />
);

export const collapseTrigger: AnnotationHandler = {
  name: "CollapseTrigger",
  onlyIfAnnotated: true,
  // The summary must be the outermost line wrapper (the first child of
  // <details>), so this handler comes before `mark` in CodeHikeHandlers.
  AnnotatedLine: ({ annotation, ...props }) => (
    <summary className="group flex w-full cursor-pointer list-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring [&::-webkit-details-marker]:hidden">
      <InnerLine merge={props} data={{ icon: chevron }} />
      {/* What a closed region hides, so it doesn't read as the whole program */}
      <span className="ml-2 shrink-0 text-muted-foreground select-none group-open/collapse:hidden">
        … {annotation.data?.hidden} lines
      </span>
    </summary>
  ),
  // Every line of a block with a collapse gets the gutter, so indentation
  // lines up whether or not the line is a toggle.
  Line: (props) => (
    <div className="flex">
      <span className="w-5 shrink-0 text-center select-none">
        {props.data?.icon as React.ReactNode}
      </span>
      {/* A box for the rest of the line, so a mark's background fills it */}
      <div className="flex-1">
        <InnerLine merge={props} />
      </div>
    </div>
  ),
};

export const collapseContent: AnnotationHandler = {
  name: "CollapseContent",
  Block: ({ children }) => <>{children}</>,
};

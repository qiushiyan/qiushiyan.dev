import { AnnotationHandler, InnerLine } from "codehike/code";

import { CustomPre } from "./focus.client";

export const focus: AnnotationHandler = {
  name: "focus",
  PreWithRef: CustomPre,
  onlyIfAnnotated: true,
  Line: (props) => (
    <InnerLine
      merge={props}
      className="px-2 opacity-50 data-[focus]:opacity-100"
    />
  ),
  AnnotatedLine: ({ annotation, ...props }) => (
    <InnerLine merge={props} data-focus={true} className="bg-accent" />
  ),
};

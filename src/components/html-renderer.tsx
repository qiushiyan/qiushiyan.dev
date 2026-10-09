import htmr from "htmr";

import { sharedComponents } from "./components-registry";
import type { HtmrOptions } from "htmr";
import type { ContentComponents } from "./components-registry";

/** Renders build-time HTML, mapping custom elements to React components. */
export const HtmlRenderer = ({
  content,
  components = sharedComponents,
}: {
  content: string;
  components?: ContentComponents;
}) =>
  htmr(content, {
    // htmr types each tag's component against that tag's own props; content
    // components take attribute strings, so the map is checked where it's built.
    transform: components as HtmrOptions["transform"],
  });

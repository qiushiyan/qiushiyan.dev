import { callout } from "./callout";
import { className } from "./classname";
import { collapse, collapseContent, collapseTrigger } from "./collapsible";
import { diff } from "./diff";
import { focus } from "./focus";
import { footnotes } from "./footnotes";
import { hover } from "./hover";
import { mark } from "./mark";
import { tokenTransitions } from "./token-transitions";

export const CodeHikeHandlers = [
  callout,
  mark,
  diff,
  hover,
  collapse,
  collapseContent,
  collapseTrigger,
  className,
  footnotes,
  focus,
  tokenTransitions,
];

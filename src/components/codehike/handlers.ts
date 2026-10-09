import { callout } from "./callout";
import { collapse, collapseContent, collapseTrigger } from "./collapsible";
import { mark } from "./mark";

// The annotations the content uses (`!collapse`, `!mark`, `!callout`).
// Order matters: earlier handlers wrap later ones. The collapse toggle has to
// be the outermost wrapper of its line (a <summary> directly inside
// <details>), and the collapse gutter then sits outside a mark's border.
export const CodeHikeHandlers = [
  collapse,
  collapseContent,
  collapseTrigger,
  mark,
  callout,
];

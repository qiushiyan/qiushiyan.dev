import { renderToStaticMarkup } from "react-dom/server";
import { Pre } from "codehike/code";

import { preClasses } from "@/components/codehike/classes";
import { CodeHikeHandlers } from "@/components/codehike/handlers";
import type { HighlightedTokens } from "@/components/codehike/highlighted";

/*
  Code blocks are rendered to HTML here, at Velite build time, rather than by
  React on each page. CodeHike composes every line and token from nested
  components; as Server Components that is tens of thousands of instances on
  an R post, which bloats the RSC payload and made React's dev-mode client
  run out of memory. The annotation handlers are server-only markup (the
  collapse toggle is a native <details>), so static HTML loses nothing.
*/
export const renderCodeHtml = (highlighted: HighlightedTokens) =>
  renderToStaticMarkup(
    <Pre
      code={{ ...highlighted, value: "", code: "", meta: "" }}
      handlers={CodeHikeHandlers}
      style={highlighted.style}
      className={preClasses}
    />
  );

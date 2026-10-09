import { AttachedPluginData, ExpressiveCodeAnnotation } from "@expressive-code/core";
import { addClassName, h, selectAll } from "@expressive-code/core/hast";
import { pluginCollapsibleSectionsData } from "@expressive-code/plugin-collapsible-sections";

import type {
  AnnotationRenderOptions,
  ExpressiveCodeLine,
  ExpressiveCodePlugin,
} from "@expressive-code/core";

/*
  Code Hike's comment annotations, read by an Expressive Code plugin so the
  content keeps its authoring syntax:

    // !mark(1:5)                 marks the next five lines
    # !collapse(1:8) collapsed    lines 2–8 fold under line 1; `collapsed` starts closed
    // !callout[/regex/] text     a note under the next line, pointing at the match
    // !callout[/regex/] text :right   the note sits to the right of the line

  Ranges count from the first code line after the comment, skipping other
  annotation comments, as in Code Hike. The comment lines are removed.

  Marks reuse the text-markers plugin's `.highlight.mark` line styles and
  collapsed ranges are handed to the collapsible-sections plugin, so this
  plugin must come after it in the plugin list.
*/

const ANNOTATION =
  /^\s*(?:\/\/|#|--|\/\*|<!--)\s*!(mark|collapse|callout)(?:\((\d+):(\d+)\)|\[\/(.+)\/\])?\s*(.*?)\s*(?:\*\/|-->)?\s*$/;

type Callout = { text: string; column: number; right: boolean };

const blockData = new AttachedPluginData<{
  annotationLines: ExpressiveCodeLine[];
  callouts: Map<ExpressiveCodeLine, Callout>;
  /** One entry per collapsed range, in line order: whether it starts open. */
  sectionsOpen: { from: ExpressiveCodeLine; open: boolean }[];
}>(() => ({ annotationLines: [], callouts: new Map(), sectionsOpen: [] }));

/** A full-line mark, rendered like the text-markers plugin's `{1-5}` ranges. */
class LineMark extends ExpressiveCodeAnnotation {
  render({ nodesToTransform }: AnnotationRenderOptions) {
    for (const node of nodesToTransform) {
      if (node.type === "element") {
        addClassName(node, "highlight");
        addClassName(node, "mark");
      }
    }
    return nodesToTransform;
  }
}

export function pluginCodeHikeAnnotations(): ExpressiveCodePlugin {
  return {
    name: "Code Hike annotations",
    hooks: {
      preprocessMetadata: ({ codeBlock }) => {
        const lines = codeBlock.getLines();
        const matches = lines.map((line) => line.text.match(ANNOTATION));
        if (!matches.some(Boolean)) return;

        const data = blockData.getOrCreateFor(codeBlock);
        const code = lines.filter((_, index) => !matches[index]);
        const sections = pluginCollapsibleSectionsData.getOrCreateFor(codeBlock);

        lines.forEach((line, index) => {
          const match = matches[index];
          if (!match) return;
          data.annotationLines.push(line);

          const [, name, from, to, pattern, query] = match;
          // The first code line after the comment is line 1 of its range.
          const anchor = code.findIndex((other) => lines.indexOf(other) > index);
          if (anchor === -1) return;
          const range = (start: number, end: number) =>
            code.slice(anchor + start - 1, anchor + end);

          if (name === "mark" && from) {
            for (const target of range(Number(from), Number(to))) {
              target.addAnnotation(new LineMark({}));
            }
          }

          // Code Hike keeps the first line of a collapsed range visible as
          // its toggle; here it stays a code line and the rest folds under it.
          if (name === "collapse" && from && Number(to) > Number(from)) {
            const folded = range(Number(from) + 1, Number(to));
            sections.sections.push({
              from: lines.indexOf(folded[0]) + 1,
              to: lines.indexOf(folded[folded.length - 1]) + 1,
              lines: folded,
            });
            data.sectionsOpen.push({
              from: folded[0],
              open: !/\bcollapsed\b/.test(query),
            });
          }

          if (name === "callout" && pattern) {
            const target = code[anchor];
            const found = new RegExp(pattern).exec(target.text);
            const right = /\s*:right$/.test(query);
            data.callouts.set(target, {
              text: query.replace(/\s*:right$/, ""),
              column: found ? found.index + found[0].length / 2 : 0,
              right,
            });
          }
        });
      },

      preprocessCode: ({ codeBlock }) => {
        const data = blockData.getOrCreateFor(codeBlock);
        if (data.annotationLines.length === 0) return;
        const lines = codeBlock.getLines();
        codeBlock.deleteLines(
          data.annotationLines.map((line) => lines.indexOf(line))
        );
      },

      postprocessRenderedLine: ({ codeBlock, line, renderData }) => {
        const callout = blockData.getOrCreateFor(codeBlock).callouts.get(line);
        if (!callout) return;
        const { text, column, right } = callout;
        // The bubble's arrow points at the middle of the matched text.
        const offset = right ? 0 : Math.max(column / 1.5, 1);
        renderData.lineAst.children.push(
          h(
            "div.ch-callout",
            {
              className: right ? ["right"] : [],
              style: `--callout-offset: ${offset}ch; --callout-arrow: ${column - offset}ch`,
            },
            text
          )
        );
        addClassName(renderData.lineAst, "has-callout");
      },

      postprocessRenderedBlock: ({ codeBlock, renderData }) => {
        const { sectionsOpen } = blockData.getOrCreateFor(codeBlock);
        if (sectionsOpen.length === 0) return;
        const lines = codeBlock.getLines();
        const states = sectionsOpen
          .toSorted((a, b) => lines.indexOf(a.from) - lines.indexOf(b.from))
          .map((section) => section.open);
        selectAll(".ec-section > details", renderData.blockAst).forEach(
          (details, index) => {
            if (states[index]) details.properties.open = true;
          }
        );
      },
    },
  };
}

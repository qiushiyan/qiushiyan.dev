import { cn } from "@/lib/utils";
import { AnnotationHandler, InlineAnnotation } from "codehike/code";

export const callout: AnnotationHandler = {
  name: "callout",
  transform: (annotation: InlineAnnotation) => {
    const { name, query, lineNumber, fromColumn, toColumn, data } = annotation;
    const { query: text, specifier } = extractDirection(query);
    return {
      name,
      query: text,
      fromLineNumber: lineNumber,
      toLineNumber: lineNumber,
      data: {
        ...data,
        column: (fromColumn + toColumn) / 2,
        direction: specifier,
      },
    };
  },
  Block: ({ annotation, children }) => {
    const { column, direction } = annotation.data;
    if (direction === "right") {
      return (
        <div className="flex items-start">
          {children}
          <div
            style={{ minWidth: `${column + 4}ch` }}
            className={cn(
              "relative mb-1 ml-[1ch] w-fit whitespace-break-spaces rounded border border-current bg-secondary px-2 text-foreground"
            )}
          >
            <div className="absolute top-1/2 h-2 w-2 -translate-x-3 -translate-y-1/2 rotate-45 border-b border-l border-current bg-secondary text-foreground" />
            {annotation.query}
          </div>
        </div>
      );
    }

    return (
      <>
        {children}
        <div
          style={{ minWidth: `${column + 4}ch` }}
          className={cn(
            "relative ml-[1ch] mt-1 w-fit whitespace-break-spaces rounded border border-current bg-secondary px-2 text-foreground"
          )}
        >
          <div
            style={{ left: `${column}ch` }}
            className="absolute -top-[1px] h-2 w-2 -translate-y-1/2 rotate-45 border-l border-t border-current bg-secondary text-foreground"
          />
          {annotation.query}
        </div>
      </>
    );
  },
};

function extractDirection(query: string) {
  const match = query.match(/^(.*?)(?::(\w+))?$/);

  if (match) {
    const [, text, specifier] = match;
    return {
      query: text.trim(),
      specifier: specifier || undefined,
    };
  }

  return { query, specifier: undefined };
}

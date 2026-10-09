import type { AnnotationHandler, InlineAnnotation } from "codehike/code";

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
          <div className="relative mb-1 w-fit rounded-md border bg-muted px-3 whitespace-break-spaces text-foreground">
            <div className="absolute top-1/2 size-2 -translate-x-4 -translate-y-1/2 rotate-45 border-b border-l bg-muted" />
            {annotation.query}
          </div>
        </div>
      );
    }

    const marginLeft = column < 20 ? 1 : column / 1.5;

    return (
      <>
        {children}
        <div
          style={{ marginLeft: `${marginLeft}ch` }}
          className="relative mt-1 w-fit rounded-md border bg-muted px-3 whitespace-break-spaces text-foreground"
        >
          <div
            style={{ left: `${column - marginLeft}ch` }}
            className="absolute -top-px size-2 -translate-y-1/2 rotate-45 border-t border-l bg-muted"
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

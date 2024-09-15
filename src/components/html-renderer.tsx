import React, { ComponentType } from "react";

import htmr from "htmr";

import { sharedComponents } from "./components-registry";

type Props = {
  content: string;
  components?: Record<string, ComponentType<any>>;
};

export const HtmlRenderer = ({
  content,
  components,
}: Props): React.ReactNode => {
  const transformComponents = components || sharedComponents;
  return htmr(content, {
    // @ts-ignore
    transform: transformComponents,
  });
};

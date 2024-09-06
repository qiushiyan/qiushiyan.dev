"use client";

import { ComponentProps } from "react";

import { Badge } from "@/components/ui/badge";
import { useTheme } from "next-themes";

import { CodeMirror } from "./codemirror";
import { baseExtensions } from "./codemirror-config";

interface Props extends ComponentProps<typeof CodeMirror> {
  code: string;
}

export const CodeEditor = ({ code, extensions, ...rest }: Props) => {
  const { theme } = useTheme();

  return (
    <div className="relative h-full">
      <Badge className="absolute right-2 top-2 z-50 bg-accent text-accent-foreground">
        Editor
      </Badge>
      <CodeMirror
        className="h-full w-full"
        value={code}
        basicSetup={{
          lineNumbers: false,
        }}
        theme={theme === "dark" ? "dark" : "light"}
        extensions={[...baseExtensions, ...(extensions ?? [])]}
        {...rest}
      />
    </div>
  );
};

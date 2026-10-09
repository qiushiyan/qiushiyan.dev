"use client";

import { ComponentProps } from "react";
import { useTheme } from "next-themes";

import { CodeMirror } from "./codemirror";
import { baseExtensions } from "./codemirror-config";
import { useEditor } from "./editor-provider";
import { PanelHeader } from "./recipes-layout";

interface Props extends ComponentProps<typeof CodeMirror> {
  code: string;
  /** Called on ⌘/Ctrl+Enter. */
  onRun?: () => void;
}

export const CodeEditor = ({ code, extensions, onRun, ...rest }: Props) => {
  const { resolvedTheme } = useTheme();
  const { file } = useEditor();

  return (
    <>
      <PanelHeader>{file.split("/").pop()}</PanelHeader>
      {/* Capture phase, so the shortcut wins over CodeMirror's own Mod-Enter (insert blank line). */}
      <div
        className="min-h-0 flex-1"
        onKeyDownCapture={(event) => {
          if (
            onRun &&
            event.key === "Enter" &&
            (event.metaKey || event.ctrlKey)
          ) {
            event.preventDefault();
            event.stopPropagation();
            onRun();
          }
        }}
      >
        <CodeMirror
          className="h-full"
          height="100%"
          value={code}
          basicSetup={{
            lineNumbers: false,
          }}
          theme={resolvedTheme === "dark" ? "dark" : "light"}
          extensions={[...baseExtensions, ...(extensions ?? [])]}
          {...rest}
        />
      </div>
    </>
  );
};

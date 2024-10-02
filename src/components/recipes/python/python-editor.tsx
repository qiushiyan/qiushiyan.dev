"use client";

import { python } from "@codemirror/lang-python";

import { CodeEditor } from "../code-editor";
import { useEditor } from "../editor-provider";

export const PythonEditor = () => {
  const { codes, file, setInput } = useEditor();
  return (
    <CodeEditor
      code={codes[file]}
      onChange={setInput}
      lang="python"
      extensions={[python()]}
    />
  );
};

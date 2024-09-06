"use client";

import { python } from "@codemirror/lang-python";

import { CodeEditor } from "../code-editor";
import { usePython } from "./python-provider";

export const PythonEditor = () => {
  const { input, setInput } = usePython();
  return (
    <CodeEditor
      code={input}
      onChange={setInput}
      lang="python"
      extensions={[python()]}
    />
  );
};

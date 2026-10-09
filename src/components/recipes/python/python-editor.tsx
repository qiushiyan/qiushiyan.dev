"use client";

import { python } from "@codemirror/lang-python";

import { CodeEditor } from "../code-editor";
import { useEditor } from "../editor-provider";
import { usePython } from "./python-provider";

const extensions = [python()];

export const PythonEditor = () => {
  const { codes, file, setInput } = useEditor();
  const { run } = usePython();

  return (
    <CodeEditor
      code={codes[file]}
      onChange={setInput}
      onRun={run}
      lang="python"
      extensions={extensions}
    />
  );
};

"use client";

import { createContext, useCallback, useContext, useState } from "react";

import { Recipe } from "#content";

type EditorContext = {
  setInput: (input: string) => void;
  setFile: (file: string) => void;
  codes: Record<string, string>;
  file: string;
};
const EditorContext = createContext<EditorContext>({} as EditorContext);

export const EditorProvider = ({
  children,
  defaultCodes,
}: {
  children: React.ReactNode;
  defaultCodes: NonNullable<Recipe[string][number]["codes"]>;
}) => {
  const [codes, setCodes] = useState(() =>
    Object.fromEntries(
      defaultCodes.map((code) => [code.filename, code.content])
    )
  );
  const [file, setFile] = useState(defaultCodes[0].filename);

  const setInput = useCallback(
    (input: string) => {
      setCodes((codes) => ({
        ...codes,
        [file]: input,
      }));
    },
    [file, setCodes]
  );

  return (
    <EditorContext.Provider
      value={{
        setInput,
        setFile,
        codes,
        file,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
};

export const useEditor = () => useContext(EditorContext);

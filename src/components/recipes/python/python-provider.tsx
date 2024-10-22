"use client";

import { createContext, useCallback, useContext } from "react";
import {
  usePython as _usePython,
  PythonProvider as ReactPythonProvider,
} from "react-py";

import { useEditor } from "../editor-provider";

type PythonContext = {
  run: () => void;
  isLoading: boolean;
  isRunning: boolean;
  stdout: string;
  stderr: string;
};
const PythonContext = createContext<PythonContext>({} as PythonContext);

export const PythonProvider = ({ children }: { children: React.ReactNode }) => {
  const { runPython, stdout, stderr, isLoading, isRunning } = _usePython();
  const { codes, file } = useEditor();

  const run = useCallback(() => {
    runPython(codes[file]);
  }, [codes, file, runPython]);

  return (
    <PythonContext.Provider
      value={{
        run,
        isLoading,
        isRunning,
        stdout,
        stderr,
      }}
    >
      <ReactPythonProvider
        packages={{
          micropip: ["requests"],
        }}
      >
        {children}
      </ReactPythonProvider>
    </PythonContext.Provider>
  );
};

export const usePython = () => useContext(PythonContext);
